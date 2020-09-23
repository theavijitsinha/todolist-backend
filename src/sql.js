'use strict';

const fs = require('fs');
const sequelize = require('sequelize');

const utils = require('./utils');

exports.conn = null;

exports.init = async function (user, host, database) {
    var password = fs.readFileSync(process.env.DB_PASS_FILE, {
        encoding: 'utf8',
        flag: 'r',
    })
    exports.conn = new sequelize.Sequelize(database, user, password, {
        host: host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
    });
    for (let i = 0; i < 5; i++) {
        var connected = await exports.conn.authenticate().then(() => {
            console.log('Connection has been established successfully.');
            return true;
        }).catch((reason) => {
            console.error(`Unable to connect to the database, Attempt: ${i + 1}, ` +
                `Reason: ${reason}`);
            return utils.delayedPromise(false, 2000);
        })
        if (connected) {
            break;
        }
    }
}