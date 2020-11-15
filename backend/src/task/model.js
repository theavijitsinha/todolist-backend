'use strict';

const sequelize = require('sequelize');

const sql = require('../sql');

class Task extends sequelize.Model { }
exports.Task = Task;

exports.init = function() {
    Task.init(
        {
            id: {
                type: sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            summary: sequelize.TEXT,
        },
        {
            sequelize: sql.conn,
            initialAutoIncrement: 1,
            paranoid: true,
        }
    );

    Task.sync({ force: true });
}
