const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map((blog) => blog.likes)
  const total = likes.length === 0 ? 0 : likes.reduce((a, b) => a + b, 0)
  return total
}

const favoriteBlog = (blogs) => {
  const sortedBlogsByLikes = blogs.sort((a, b) => b.likes - a.likes)
  console.log('Favorite Blog', {
    title: sortedBlogsByLikes[0].title,
    author: sortedBlogsByLikes[0].author,
    likes: sortedBlogsByLikes[0].likes,
  })
  return sortedBlogsByLikes[0]
}

const mostBlogs = (blogs) => {
  const authorsBlogsCount = _.countBy(blogs, 'author')

  const mostBlogsAuthor = _.maxBy(
    Object.keys(authorsBlogsCount),
    (author) => authorsBlogsCount[author],
  )
  return {
    author: mostBlogsAuthor,
    blogs: authorsBlogsCount[mostBlogsAuthor],
  }
}

const mostLikes = (blogs) => {
  const authorsAndLikes = _.reduce(
    blogs,
    (result, blog) => {
      if (result[blog.author]) {
        result[blog.author] += blog.likes
      } else {
        result[blog.author] = blog.likes
      }
      return result
    },
    {},
  )
  const mostLikedAuthor = _.maxBy(
    Object.keys(authorsAndLikes),
    (author) => authorsAndLikes[author],
  )
  const result = {
    author: mostLikedAuthor,
    likes: authorsAndLikes[mostLikedAuthor],
  }
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
