var tasks = {};
var nextIndex = 0;

exports.index = function (req, res) {
    res.send(Object.values(tasks));
};

exports.create = function (req, res) {
    tasks[nextIndex] = {
        id: nextIndex,
        description: req.body.description,
    };
    nextIndex++;
    res.send("Done");
};

exports.show = function (req, res) {
    res.send(tasks[req.params.task]);
};

exports.update = function (req, res) {
    tasks[req.params.task] = {
        id: req.params.task,
        description: req.body.description,
    };
    res.send("Done");
};

exports.destroy = function (req, res) {
    delete tasks[req.params.task];
    res.send("Done");
};