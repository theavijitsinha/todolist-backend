'use strict';

const fs = require('fs')

const sequelize = require('sequelize')

exports.conn = null;

exports.init = function (user, host, database) {
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
}

