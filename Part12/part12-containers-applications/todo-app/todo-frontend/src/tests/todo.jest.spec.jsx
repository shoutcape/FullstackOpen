import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Todo from '../Todos/Todo'

describe('renders', () => {
  it('Renders todo component', () => {
    const todo = {
      text: 'Text goes here',
      done: false
    }
    const onClickComplete = jest.fn()
    const onClickDelete = jest.fn()

    render(<Todo todo={todo} onClickDelete={onClickDelete} onClickComplete={onClickComplete} />)

    expect(screen.getByText("Text goes here")).toBeVisible()
  })
})

