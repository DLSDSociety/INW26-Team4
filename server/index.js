const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Shopit' })
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})