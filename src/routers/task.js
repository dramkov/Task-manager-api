const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }

  // task
  //   .save()
  //   .then(() => {
  //     res.status(201).send(task);
  //   })
  //   .catch((err) => {
  //     res.status(400).send(err);
  //   });
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=10
//GET /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: 'tasks',
        match: match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sort,
        },
      })
      .execPopulate();

    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }

  // Task.find({})
  //   .then((tasks) => {
  //     res.status(200).send(tasks);
  //   })
  //   .catch((e) => {
  //     res.status(500).send();
  //   });
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }

  // Task.findById(_id)
  //   .then((task) => {
  //     if (!task) {
  //       return res.status(404).send();
  //     }
  //     res.status(200).send(task);
  //   })
  //   .catch((e) => {
  //     res.status(500).send();
  //   });
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ['description', 'completed'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdate.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    // const task = await Task.findById(_id);

    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findOneAndDelete(_id);
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
