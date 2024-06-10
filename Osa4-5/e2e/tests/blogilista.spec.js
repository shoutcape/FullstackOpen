const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./testHelper')

describe('Blog list', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Ville Kautiainen',
        username: 'shoutcape',
        password: 'salainen',
      },
    })
    await request.post('/api/users', {
      data: {
        name: 'Väärä Kautiainen',
        username: 'huutoviitta',
        password: 'salainen',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginform = page.getByText('login to application')
    await expect(loginform).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      loginWith(page, 'shoutcape', 'salainen')
      await expect(page.getByText('Ville Kautiainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      loginWith(page, 'shoutcape', 'wrong password')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'shoutcape', 'salainen')
      })

      test('a new blog can be created and liked', async ({ page }) => {
        const content = {
          author: 'test Author',
          title: 'test Title',
          url: 'test Url.com',
        }
        await createBlog(page, content, true)
        await page.getByRole('button', { name: 'view' }).click()

        const likesBefore = await page.getByTestId('likes').innerText()
        const likesBeforeValue = parseInt(likesBefore, 10)

        await page.getByRole('button', { name: 'like' }).click()

        //wait for the like value to update
        await page.getByText(`${parseInt(likesBefore, 10) + 1}`).waitFor()

        const likesAfter = await page.getByTestId('likes').innerText()
        const likesAfterValue = parseInt(likesAfter, 10)

        expect(
          page.getByText(
            `a new blog ${content.title} by ${content.author} added`,
          ),
        ).toBeVisible()
        expect(
          page.getByText(`${content.title} ${content.author}`),
        ).toBeVisible()
        expect(likesBeforeValue < likesAfterValue).toBeTruthy()
      })

      test('a blog can be deleted by the creator', async ({ page }) => {
        const content = {
          author: 'test Author',
          title: 'test Title',
          url: 'test Url.com',
        }
        //listener for the dialog box
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })
        await createBlog(page, content, true)
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        //wait for blog to get removed
        await page.waitForTimeout(100)
        expect(page.getByText('test Title test Author')).not.toBeVisible()
      })

      test('Only blog creator sees remove button', async ({ page }) => {
        const content = {
          author: 'test Author',
          title: 'test Title',
          url: 'test Url.com',
        }
        await createBlog(page, content, true)
        await page.getByRole('button', { name: 'logout' }).click()

        await loginWith(page, 'huutoviitta', 'salainen')
        await page.getByRole('button', { name: 'view' }).click()

        expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are ordered by amount of likes', async ({ page }) => {
        const content1 = {
          author: 'test Author',
          title: 'test with most likes',
          url: 'test Url.com',
        }
        const content2 = {
          author: 'test Author',
          title: 'test with least likes',
          url: 'test Url.com',
        }
        const content3 = {
          author: 'test Author',
          title: 'test with likes',
          url: 'test Url.com',
        }
        await createBlog(page, content1, true)
        await createBlog(page, content2, true)
        await createBlog(page, content3, true)

        //open all blog informations
        const viewButtons = await page.getByRole('button',{ name:'view' }).all()
        for (let _button of viewButtons) {
          await viewButtons[0].click()
          await page.waitForTimeout(100)
        }

        const likeButtons = await page.getByRole('button',{ name:'like' }).all()
        
        //like the first blog 2 times
        await likeButtons[0].click()
        await page.waitForTimeout(50)
        await likeButtons[0].click()
        await page.waitForTimeout(50)

        //like the last blog
        await likeButtons[2].click()
        await page.waitForTimeout(50)

        const likesElements = await page.getByTestId('likes').allTextContents()
        const likeList = []

        for (let likeElement of likesElements) {
          const like = parseInt(likeElement, 10)
          likeList.push(like)
        }
        const sortedLikeList = likeList.sort((a, b) => b - a)
        expect(likeList === sortedLikeList).toBeTruthy
      })
    })
  })
})
