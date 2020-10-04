const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.use(express.json()); // parse incoming JSON to an object

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

/////////////Middleware

// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('GET requests are disable');
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send('You cannot do this');
// });

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//   // const task = await Task.findById('5f7579ff876e413188b983be');
//   // await task.populate('owner').execPopulate();
//   // console.log(task.owner);

//   const user = await User.findById('5f75793517e4f90484c27bf9');
//   await user.populate('tasks').execPopulate();
//   console.log(user.tasks);
// };

// main();

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//   const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', {
//     expiresIn: '7 days',
//   });
//   console.log(token);

//   const data = jwt.verify(token, 'thisismynewcourse');
//   console.log(data);
// };

// myFunction();
