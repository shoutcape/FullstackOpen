import { Link } from "react-router-dom"

const BlogList = ({ blogs }) => {

  if (!blogs) {
    return null
  }

  return (
    <div className="BlogList">
      {
        blogs && blogs.map((blog) => (
          <Link key={blog.id} to={`/api/blogs/${blog.id}`}>
            <div className='blog'>
              {blog.title} {blog.author}
            </div>
          </Link>
        ))}
    </div>
  )
}

export default BlogList
