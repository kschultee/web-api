const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bParser = require('body-parser')
const path = require('path')
const app = express()

app.use(bParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/notes', (req, res) => {
  MongoClient.connect('mongodb://localhost/', (err, client) => {
    if (err) throw err
    const db = client.db('library')
    const notes = db.collection('notes')
    notes.insertOne(req.body)
  })
})

app.listen(3000, () => {
  'Listening on port 3000'
})