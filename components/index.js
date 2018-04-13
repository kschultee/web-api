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
  MongoClient.connect('mongodb://localhost/notes', (err, client) => {
    if (err) throw err
    const db = client.db('library')
    const notes = db.collection('notes')
    notes.insertOne(req.body, (err, res) => {
      if (err) throw err
      console.log(res)
    })
  })
})

app.get('/notes', (req, res) => {
  MongoClient.connect('mongodb://localhost/notes', (err, client) => {
    if (err) throw err
    const db = client.db('library')
    const notes = db.collection('notes')
    notes
      .find()
      .toArray(function (err, results) {
        if (err) throw err
        res.json(results)
      })
  })
})

app.put('/notes', bParser.json(), (req, res) => {
  MongoClient.connect('mongodb://localhost/notes', (err, client) => {
    let id = req.body.id
    let update = req.body.note
    if (err) throw err
    const db = client.db('library')
    const notes = db.collection('notes')
    notes
      .findOneAndUpdate({id}, {$set: {'note': update}}, (err, results) => {
        if (err) throw err
        res.json(results)
      })
  })
})

app.delete('/notes', bParser.json(), (req, res) => {
  MongoClient.connect('mongodb://localhost/notes', (err, client) => {
    if (err) throw err
    let id = req.body.id
    const db = client.db('library')
    const notes = db.collection('notes')
    notes
      .remove({id}, true)
    console.log(res)
  })
})

app.listen(3000, () => {
  'Listening on port 3000'
})
