const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

// const task = new Task({
//   description: 'clean the house',
//   completed: false,
// });

// task
//   .save()
//   .then(() => {
//     console.log(task);
//   })
//   .catch((err) => console.log(err));

module.exports = Task;
