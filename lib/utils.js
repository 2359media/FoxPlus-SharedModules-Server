import { inspect as _inspect } from 'util';
import { v4 as uuid } from 'uuid';
import { get as contextGet } from 'express-http-context';
import request from 'request-promise';

export default class Utility {
    /**
     * Async request
     * @param {string} name request name
     * @param {object} options request options
     */
    static async request(name, options) {
        const reqId = uuid().split('-')[0];
        const path = options.uri.split('/').slice(3).join('/');
        const logBody = Object.keys(options.body || {}).length ? `body ${Utility.inspect(options.body)}, ` : '';
        const logQuery = Object.keys(options.qs || {}).length ? `query ${Utility.inspect(options.qs)}` : '';
        Utility.log(`${name} [${reqId}]: ${options.method} /${path}, ${logBody}${logQuery}`);

        try {
            const res = await request(options);
            Utility.log(`${name} [${reqId}]: Response ${Utility.inspect(res)}`);
            return res;
        } catch (err) {
            Utility.log(`${name} [${reqId}]: Error ${err.message}`);
            throw err;
        }
    }

    /**
     * Obfuscate `email` or `text` for console log.
     * @param {object} options
     * @param {string} options.email email
     * @param {string} options.text text
     * @param {string} options.visible number of visible character
     */
    static obfuscate(options) {
        if (typeof options.email === 'string') {
            const separatorIdx = options.email.lastIndexOf('@') - 3;
            return separatorIdx > 0 ?
                `${'x'.repeat(separatorIdx)}${options.email.slice(separatorIdx)}` :
                options.email.slice();
        } else if (typeof options.text === 'string') {
            options.visible = options.visible || 3;
            const hidden = options.text.length - options.visible;
            const hiddenText = () => (hidden > 8 ? `[x${hidden}]` : 'x'.repeat(hidden));
            return hidden > 0 ?
                `${options.text.substring(0, options.visible)}${hiddenText()}` :
                options.text.slice();
        }

        return JSON.parse(JSON.stringify(options));
    }

    /**
     * Filter `params` for console log.
     */
    static filter(params) {
        if (!params) {
            return params;
        } else if (params instanceof Array) {
            return params.map(param => Utility.filter(param));
        } else if (params instanceof Object) {
            const filtered = {};

            for (const key of Object.keys(params)) {
                const _key = key.toLowerCase();

                if (typeof params[key] === 'string') {
                    if (_key.indexOf('time') >= 0 || _key.indexOf('expi') >= 0) {
                        filtered[key] = params[key];
                    } else if (_key.indexOf('token') >= 0 || _key.indexOf('pass') >= 0 || _key.indexOf('key') >= 0) {
                        filtered[key] = '[filtered]';
                    } else if (_key.indexOf('name') >= 0) {
                        filtered[key] = Utility.obfuscate({ text: params[key], visible: 4 });
                    } else if (_key.indexOf('email') >= 0) {
                        filtered[key] = Utility.obfuscate({ email: params[key] });
                    } else {
                        filtered[key] = params[key];
                    }
                } else if (params[key] === undefined) {
                    // ignored
                } else {
                    filtered[key] = Utility.filter(params[key]);
                }
            }

            return filtered;
        }

        return JSON.parse(JSON.stringify(params));
    }

    /**
     * Inspect `params` for console log. Details only if LOG_DETAILS != `disabled`
     */
    static inspect(params) {
        if (process.env.LOG_DETAILS === 'disabled') {
            return params;
        }

        if (!params) { return '{}'; }

        if (process.env.LOG_DETAILS === 'filtered') {
            params = Utility.filter(params);
        }

        return _inspect(params, { showHidden: true, depth: null }).replace(/\n/g, '').replace(/\s+/g, ' ');
    }

    /**
     * Console log `info`. Disabled by setting evironment variable LOG_DETAILS = `disabled`
     * @param {string} info
     */
    static log(info) {
        if (process.env.LOG_DETAILS !== 'disabled') {
            console.log(`[${contextGet('requestLogId')}] ${info}`); // eslint-disable-line
        }
    }
}
