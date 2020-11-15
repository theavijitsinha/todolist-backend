'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Task } = require('./model');

require('./model');

// Router for '/tasks' path
exports.router = function () {
    var taskRouter = express.Router();
    // Tasks API
    // Parse request body for POST and PUT requests
    taskRouter.route('*')
        .post(bodyParser.json())
        .put(bodyParser.json());
    // Define tasks API endpoints
    taskRouter.route('/')
        .get(getAll)
        .post(add);
    taskRouter.route('/:id')
        .get(fetchTask, get)
        .put(fetchTask, update)
        .delete(fetchTask, remove);
    return taskRouter;
}

function sendError(res, code, message, detail) {
    var err = {
        code: code,
        message: message,
        detail: detail,
    }
    res.status(code).json(err)
}

async function fetchTask(req, res, next) {
    var taskID = req.params.id;
    if (!Number.isSafeInteger(+taskID) || +taskID < 0) {
        sendError(res, 400, 'Invalid Task ID', 'Task ID must be a non-negative integer');
        return;
    }
    const task = await Task.findByPk(+req.params.id, {
        attributes: {
            exclude: ['deletedAt'],
        }
    });
    if (task === null) {
        sendError(res, 404, 'Task not found', 'Task with the given ID does not exist');
        return;
    }
    req.task = task;
    next();
}

async function getAll(req, res) {
    const tasks = await Task.findAll({
        attributes: {
            exclude: ['deletedAt'],
        }
    });
    res.status(200).json(tasks);
};

async function add(req, res) {
    const task = await Task.create({ summary: req.body.summary });
    res.status(201).location('/tasks/' + task.id).json(task);
};

async function get(req, res) {
    res.status(200).json(req.task);
};

async function update(req, res) {
    req.task.summary = req.body.summary
    await req.task.save()
    res.status(200).json(req.task);
};

async function remove(req, res) {
    await req.task.destroy();
    res.status(204).end();
};