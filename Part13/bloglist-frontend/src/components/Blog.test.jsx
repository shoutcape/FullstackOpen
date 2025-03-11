import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const user = {
  id: 'testId',
  name: 'testName',
  username: 'testUsername',
}

const blog = {
  title: 'testTitle',
  author: 'testAuthor',
  id: '665eed97e40830a28f6c6db5',
  url: 'testUrl',
  likes: 'testLikes',
  name: 'testName',
  user: user,
}

test('Renders title and author', () => {
  render(<Blog blog={blog} />)

  const element = screen.getByText('testTitle testAuthor')
  expect(element).toBeDefined()
})

test('Renders likes,url, user on view button press', async () => {
  render(<Blog blog={blog} user={user} />)
  const testUser = userEvent.setup()
  const button = screen.getByText('view')
  await testUser.click(button)

  const urlElement = screen.getByText('testUrl')
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('testLikes')
  expect(likesElement).toBeDefined()

  const nameElement = screen.getByText('testName')
  expect(nameElement).toBeDefined()
})

test('Like button is called two times when pressed two times', async () => {


  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} mockHandler={mockHandler}/>)

  const testUser = userEvent.setup()
  const viewButton = screen.getByText('view')
  await testUser.click(viewButton)

  const likeButton = screen.getByText('like')
  await testUser.click(likeButton)
  await testUser.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})

