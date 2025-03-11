const Blog = require("./models/blog")


const main = async () => {
  const blogs = await Blog.findAll()
  for (const blog of blogs) {
    const { dataValues } = blog
    const { author, title, likes} = dataValues
    console.log(`${author}: '${title}', ${likes} likes`)
  }
}

main()



