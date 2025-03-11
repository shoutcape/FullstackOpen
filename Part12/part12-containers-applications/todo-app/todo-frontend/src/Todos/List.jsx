import Todo from "./Todo"

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => () => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => () => {
    completeTodo(todo)
  }

  return (
    <>
      {todos.map((todo, index) => (
        <Todo
        key={index}
        todo={todo}
        onClickComplete={onClickComplete}
        onClickDelete={onClickDelete}
      />
      )).reduce((acc, cur, index) => [...acc, <hr key={index + todos.length} />, cur], [])}
    </>
  )
}

export default TodoList
