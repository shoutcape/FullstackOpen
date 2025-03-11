const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  console.log(todos)
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const currentCount = await redis.getAsync('added_todos')
  currentCount 
    ? redis.setAsync("added_todos", parseInt(currentCount) + 1) 
    : redis.setAsync("added_todos", 1)

  res.send(todo);
});

router.get('/statistics', async (_, res) => {
  const added_todos = await redis.getAsync('added_todos')
  res.send({
    added_todos: added_todos || "0"
  })
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo
  if (todo) {
    res.send(req.todo)
  }
  res.sendStatus(405);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = req.body

  const updatedTodo = await Todo.findByIdAndUpdate(
    req.todo._id,
    {...todo},
    {
      new: true,
      useFindAndModify: false
    }
  )
  if (updatedTodo) {
    return res.json(updatedTodo)
  }
  res.sendStatus(405);
});



router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
