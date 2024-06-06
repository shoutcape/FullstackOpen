import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './newBlogForm'
import { expect } from 'vitest'

test('form calls the right information wiht the callback function', async () => {
  const addBlog = vi.fn()
  const testUser = userEvent.setup()

  render(<NewBlogForm addBlog={addBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  await testUser.type(titleInput, 'testTitle')
  await testUser.type(urlInput, 'testUrl')
  await testUser.type(authorInput, 'testAuthor')

  await testUser.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toEqual({
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl',
  })
})
