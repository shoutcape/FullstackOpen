const Blog = require('./blog')
const Session = require('./session')
const User = require('./user')
const UserBlogs = require('./user_blogs')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'readings'})
Blog.belongsToMany(User, { through: UserBlogs, as: 'reading_list'})

module.exports = {
  Blog,
  User,
  UserBlogs,
  Session
}

