const express = require('express')
const cros = require('cors')

const app = express()
app.use(cros())

app.use(express.urlencoded({ extended: true }))

app.post('/tracker', (req, res) => {
  console.log(req.body);
  // res.send(200)
  res.sendStatus(200)
})

app.listen(3160, () => {
  console.log('server port is at 3160');
})
