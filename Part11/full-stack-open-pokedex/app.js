const express = require('express')
const app = express()

// get the port from env variable
const PORT = process.env.PORT || 5000


//new line here

app.use(express.static('dist'))

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server started on port ${PORT}`)
})

app.get('/health', (_req, res) => {
  // eslint-disable-next-line no-constant-condition
  if (false) throw('error...  ')
  res.send('ok')
})
