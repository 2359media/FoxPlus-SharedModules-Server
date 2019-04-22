const BaseRequest = require('./baseRequest');
const { AppError, ErrorCode } = require('../../appError');
const moment = require('moment');
const CachingService = require('../caching');
const QueueService = require('../queue');

const cacheService = new CachingService('{mpx}', process.env.MEDIA_CACHE_EXPIRY || 86400);
const queueService = new QueueService('media');

const AvailabilityTags = {
    all: [
        'fmp',
        'ffm',
        'fam',
        'fx',
        'fox',
        'foxcrime',
        'scm',
        'scci',
        'other',
    ],
    sg: [
        'sg',
        'scm_sg',
        'scc_sg',
        'fx_sg',
        'fox_sg',
        'starworld_sg',
    ],
    ph: [
        'ph',
    ],
    ngc: [
        'ngc',
        'ngp',
        'ngw',
    ],
};

const RegionAvailability = {
    sg: ['all', 'sg', 'ph', 'ngc'],
    ph: ['all', 'sg', 'ph', 'ngc'],
};

const MediaFields = [
    'title',
    'guid',
];

const MediaBaseFields = [
    'id',
    'programType',
    'year',
    '$isDownloadable',
    '$foxplay-Genre',
    'media.content.duration',
    'seriesTvSeasons',
    'seriesId',
    'tvSeasonEpisodeNumber',
    'tvSeasonNumber'
];

const MediaDetailFields = MediaFields.concat(MediaBaseFields, [
    'description',
    '$marketRating',
    '$viewerAdvices',
    'credits.creditType',
    'credits.personName',
    'media.content.format',
    'media.content.releases.url',
]);

class GetMedia extends BaseRequest {
    constructor(guids = [], fields = [], countryTag, locale, detailed) {
        super();
        this._guids = guids;
        this._fields = fields;
        this._countryTag = countryTag;
        this._locale = locale;
        this._detailed = detailed;
    }

    get queryParams() {
        const params = {
            byRequiredAvailability: 'media',
            byMediaAvailabilityState: 'available',
            byMediaAvailabilityTags: this._availabilityTagsString
        };
        if (this._guids && this._guids.length) {
            params.byGuid = this._guids.join('|');
        }

        if (this._fields && this._fields.length) {
            params.fields = this._fields.join(',');
        }
        return params;
    }

    get _availabilityTagsString() {
        const tags = [];
        if (RegionAvailability[this._countryTag]) {
            const scopes = RegionAvailability[this._countryTag];
            Object.keys(AvailabilityTags).map((key) => { // eslint-disable-line
                if (scopes.includes(key) === true) {
                    tags.push(AvailabilityTags[key].join('|'));
                }
            });
        }
        return tags.join('|');
    }

    get response() {
        if (this.isSuccess) {
            return this._response;
        }
        throw new AppError(ErrorCode.Catalog.General);
    }

    async get() {
        try {
            const cache = await this.getCachedResponse();
            if (cache.length === this._guids.length) {
                return cache;
            }
            this._guids = this._guids.filter((guid) => {
                return !cache.find((c) => { return c.guid === guid; });
            });
            const response = await this.executeCommand();
            return (await standardize(response.entries || [], this._countryTag, this._detailed)).concat(cache); // eslint-disable-line
        } catch (err) {
            throw new AppError(ErrorCode.Catalog.General, err);
        }
    }

    async getCachedResponse() {
        if (this._guids && this._guids.length) {
            const cache = await cacheService.getMultipleData(this._guids) || [];
            const matchesGuids = this._guids.filter((guid) => {
                return !!cache.find((c) => { return c.guid === guid; });
            });
            if (matchesGuids.length > 0) { await queueService.addMultiple(matchesGuids); }
            return cache;
        }
        return [];
    }

    async saveResponseCache(response) {
        const data = await standardize(response.entries || [], this._countryTag, this._detailed); // eslint-disable-line
        if (data.length > 0) {
            const keyData = data.map((d) => {
                return {
                    key: d.guid,
                    data: JSON.stringify(d)
                };
            });
            await Promise.all([
                cacheService.setMultipleData(keyData),
                queueService.addMultiple(keyData.map(k => k.key))
            ]);
        }
        return null;
    }
}

class GetSeriesEpisodeNumbers extends BaseRequest {
    constructor(seriesId) {
        super();
        this._seriesId = seriesId;
    }

    get queryParams() {
        const params = {
            range: '1-1',
            byseriesid: this._seriesId,
            count: 'true',
            fields: 'id',
            byRequiredAvailability: 'media',
            byMediaAvailabilityState: 'available',
        };
        return params;
    }

    get response() {
        if (this.isSuccess) {
            return this._response.totalResults;
        }

        throw new AppError(ErrorCode.Catalog.General);
    }

    get cacheKey() {
        return `getSeriesEpisodeNumbers:${this._seriesId}`;
    }
}

class GetEpisodesBySeriesIds extends GetMedia {
    constructor(seriesIds = [], fields = [], countryTag, locale, detailed) {
        super();
        this._guids = seriesIds;
        this._fields = fields;
        this._countryTag = countryTag;
        this._locale = locale;
        this._detailed = detailed;
    }

    get queryParams() {
        const params = {
            range: '1-1000',
            byRequiredAvailability: 'media',
            byMediaAvailabilityState: 'available',
            byMediaAvailabilityTags: this._availabilityTagsString
        };
        if (this._guids && this._guids.length) {
            params.byseriesid = this._guids.join('|');
        }

        if (this._fields && this._fields.length) {
            params.fields = this._fields.join(',');
        }
        return params;
    }
}

class RefreshCache extends GetMedia {
    constructor(guids = [], fields = [], countryTag, locale, detailed) {
        super();
        this._guids = guids;
        this._fields = fields;
        this._countryTag = countryTag;
        this._locale = locale;
        this._detailed = detailed;
    }

    async get() {
        try {
            const medias = await queueService.get();
            this._guids = medias.map((media) => { return media.split(':')[1]; });
            await queueService.roundRobin(this._guids);
            return this.executeCommand();
        } catch (err) {
            throw new AppError(ErrorCode.Catalog.General, err);
        }
    }
}

async function standardize(entries, country, detailed = false) {
    if (entries === undefined) {
        return [];
    }
    return Promise.all(entries
        .filter(entry => ['series', 'sportingEvent', 'movie', 'other', 'episode'].includes(entry.programType))
        .map(async (entry) => {
            const data = {
                id: entry.id.replace('http://data.entertainment.tv.theplatform.com/entertainment/data/ProgramAvailability/', ''),
                guid: entry.guid,
                title: entry.title,
                type: entry.programType,
                year: entry.year,
                downloadable: entry.pl1$isDownloadable === true,
                genre: entry['pl1$foxplay-Genre'] && entry['pl1$foxplay-Genre'].toLowerCase(),
                duration: 0,
                seriesId: entry.seriesId,
                tvSeasonEpisodeNumber: entry.tvSeasonEpisodeNumber,
                tvSeasonNumber: entry.tvSeasonNumber

            };
            if (detailed === true) {
                data.description = entry.description;
                if (entry.pl1$marketRating !== undefined && entry.pl1$marketRating[country.toLowerCase()] !== undefined) { // eslint-disable-line
                    data.rating = entry.pl1$marketRating[country];
                }
                if (entry.pl1$viewerAdvices !== undefined) {
                    data.viewerAdvice = entry.pl1$viewerAdvices;
                }
                if (entry.credits.length > 0) {
                    data.credits = entry.credits.map((credit) => {
                        return {
                            role: credit.creditType ? credit.creditType.toLowerCase() : '',
                            name: credit.personName ? credit.personName.toLowerCase() : '',
                        };
                    });
                }
                entry.media.map((media) => { // eslint-disable-line
                    const filmstrip = media.content.filter(m => m.format.toLowerCase() === 'filmstrip');
                    if (filmstrip[0]) {
                        data.filmstrip = filmstrip[0].releases[0].url;
                    }
                });
            }
            if (entry.programType === 'series') {
                if (entry.seriesTvSeasons) {
                    data.seasonsAvailable = entry.seriesTvSeasons.length;
                    if (detailed === true) {
                        data.seasons = entry.seriesTvSeasons
                            // .filter((season: any) => season.startYear !== undefined)
                            .map(({
                                id, guid, title, tvSeasonNumber, startYear
                            }) => {
                                return {
                                    id: id.replace('http://data.entertainment.tv.theplatform.com/entertainment/data/TvSeason/', ''),
                                    guid,
                                    title,
                                    ordinal: tvSeasonNumber,
                                    year: startYear,
                                };
                            });
                    }
                }
            } else {
                const hasMedia = entry.media && entry.media.length;
                const hasMediaContent = hasMedia && entry.media[0].content && entry.media[0].content.length;

                if (hasMediaContent) {
                    const duration = Math.max.apply(null, entry.media[0].content.map(content => content.duration));
                    data.duration = Number(moment.duration(duration, 'seconds').asMinutes().toFixed(0));
                } else {
                    return null;
                }
            }

            if (detailed === true && ['movie', 'series', 'others', 'documentaries'].includes(data.type)) {
                const episodesAvailable = await new GetSeriesEpisodeNumbers(data.id).get();
                data.episodesAvailable = episodesAvailable;
            }
            return data;
        }))
        .then(medias => medias.filter(media => !!media));
}

module.exports = {
    checkMediaExistenceByGuids: async (guids = [], countryTag) => {
        const response = (guids.length) ? await new GetMedia(guids, ['guid'], countryTag).get() : { entries: [] };
        const exists = response.entries.map(entry => entry.guid);
        const missing = guids.filter(entry => exists.includes(entry) === false);
        return { exists, missing };
    },

    getMediaByGuids: async (guids = [], countryTag, locale, detailed) => {
        return (guids.length)
            ? new GetMedia(guids, MediaDetailFields, countryTag, locale, detailed).get() : [];
    },

    getEpisodesBySeriesIds: async (seriesIds = [], countryTag, locale, detailed) => {
        return (seriesIds.length)
            ? new GetEpisodesBySeriesIds(seriesIds, MediaDetailFields, countryTag, locale, detailed).get() : [];
    },

    refreshMediaCache: async () => {
        return new RefreshCache().get([], MediaDetailFields, 'sg');
    }
};
