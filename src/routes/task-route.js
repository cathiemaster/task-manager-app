const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

/**
 * Get all tasks as admin 
 */
/* router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
}); */

/**
 * GET all tasks
 */
/* router.get("/tasks", auth, async (req, res) => {
    try {
        //const tasks = await Task.find({});
        const tasks = await Task.find({ "user": req.user._id });

        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
}); * /

/**
 * GET using a query param (completed), and using pagination (limits, skip)
 * 
 *  - GET /tasks?completed=true
 *  - GET /tasks?limit=10&skip=10
 */
router.get("/tasks", auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send();
    }
    /* Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((e) => {
        res.status(500).send();
    });*/
});


router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, "user": req.user._id });
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.post("/task", auth, async (req, res) => {
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        user: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    };
});

/**
 * Updates user field as admin
 */
/* router.patch("/tasks/:id", async (req, res) => {
    const updateKeys = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOp = updateKeys.every((update) => allowedUpdates.includes(update));

    if (!isValidOp) {
        return res.status(400).send({ "error": "Invalid updates!!" })
    }

    try {
        const task = await Task.findById(req.params.id);
        updateKeys.forEach((key) => task[key] = req.body[key]);

        await task.save()

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task)
    } catch (e) {
        console.log(e)
        res.status(400).send();
    }
}); */

router.patch("/tasks/:id", auth, async (req, res) => {
    const updateKeys = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOp = updateKeys.every((update) => allowedUpdates.includes(update));

    if (!isValidOp) {
        return res.status(400).send({ "error": "Invalid updates!!" })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
        updateKeys.forEach((key) => task[key] = req.body[key]);

        await task.save()

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task)
    } catch (e) {
        console.log(e)
        res.status(400).send();
    }
});

/**
 * Delete task by id as an admin
 */
/* router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send()
        }

        res.send(task);
    } catch (e) {
        res.status(400).send();
    }
}); */

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).send()
        }

        res.send(task);
    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;