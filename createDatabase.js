const { readdirSync } = require('fs');
const { basename: _basename, join } = require('path');
const Sequelize = require('sequelize');
const { createNamespace } = require('continuation-local-storage');
const { log } = require('./utils');

/**
 * @typedef { function({[x: string]: object}, string): void } Hook
 */
/**
 * create sequelize db
 * @param {string} clsName CLS namespace name
 * @param {string} dbUri dialect://username:password(at)host:port/database
 * @param {Array<Hook>} modelHooks hooks
 */
module.exports = (clsName, dbUri, modelHooks) => {
    const sequelizeNS = createNamespace(`sequel-cls-${clsName}`);
    Sequelize.useCLS(sequelizeNS);

    const sequelize = new Sequelize(dbUri, { logging: log });
    const basename = _basename(__filename);
    const files = readdirSync(__dirname)
        .filter(file => (file.indexOf('.') > 0) && (file !== basename) && (file !== 'config.js'));

    const db = {};
    for (const file of files) {
        const model = sequelize.const(join(__dirname, file));
        db[model.name] = model;
    }

    for (const modelName of Object.keys(db)) {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }

        for (const hook of modelHooks) {
            hook(db, modelName);
        }
    }

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};
