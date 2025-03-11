# CI Setup for Lua Application

## Tools for Lua

1. **Linting**: For linting we could use a tool called Luacheck. It's like eslint for lua, it can be used manually to check for mistakes, or be ran continuously in the background to instantly notify of any errors or mistakes that might be occurring.

2. **Testing**: Busted is a popular choice for testing. It helps us write and run tests to make sure our code works as expected.

3. **Building**: LuaRocks is the go-to tool here. It helps manage our project's dependencies and create packages we can share, just like npm.

## Other CI Options

Besides Jenkins and GitHub Actions, there are other ways to set up CI:

- GitLab CI/CD: Good if you're already using GitLab
- CircleCI: A cloud option that's known for being fast
- Travis CI: Another popular choice with lots of community support

## Self-hosted or Cloud-based?

Choosing between self-hosted and cloud-based CI depends on a few things:

- Cloud is easier to set up and maintain, great for smaller teams.
- Self-hosted gives you more control but requires more work to manage.

To decide, we'd need to know:
1. How secure does our app need to be?
2. Do we have the skills to manage our own CI setup?
3. How much CI work do we expect to do?
4. Are there any rules we need to follow about where our code can be?

In the end, we should pick what works best for our team and our app. It's about finding the right balance between ease of use and control.
