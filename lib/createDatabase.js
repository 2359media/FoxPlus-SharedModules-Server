import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize, { useCLS } from 'sequelize';
import { createNamespace } from 'continuation-local-storage';
import { log } from './utils';

export default function (name, dbUri) {
    const sequelizeNS = createNamespace(`sequel-cls-${name}`);
    useCLS(sequelizeNS);
    
    const sequelize = new Sequelize(dbUri, { logging: log });    
    const basename = _basename(__filename);
    const files = readdirSync(__dirname)
        .filter(file => (file.indexOf('.') > 0) && (file !== basename) && (file !== 'config.js'));
    
    const db = {};
    for (const file of files) {
        const model = sequelize.import(join(__dirname, file));
        db[model.name] = model;
    }
    
    for (const modelName of Object.keys(db)) {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    }
    
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
}
