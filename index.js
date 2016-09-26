// ---Server
const express = require('express')
var http = require('http')
const app = express()
var server = http.createServer(app)
const PORT = 8081

// ---Database
const low = require('lowdb')
const db = low('db.json')
// --Init

db.defaults({ records: [] }).value()

//Root index.html
app.use('/', express.static('.'))

//Store jerk
app.get("/save",function(req, res){
    var jerks = db.get("records").find({ type: "jerk" }).value()
    if (jerks === undefined) {
        jerks = db.get('records').push({ type: "jerk", count: 0}).value()
    } else {
        jerks = db.get("records").find({ type: "jerk" }).assign({count: jerks.count + 1}).value()
    }
    res.json({action: "save", count: jerks.count || 0})
})

//How many jerks
app.get("/count",function(req, res){
    var jerks = db.get("records").find({ type: "jerk" }).value()
    res.json({action:"count", count: jerks.count})
})
//Clear Jerks
app.get("/clear",function(req, res){
    var jerks = db.get("records").find({ type: "jerk" }).assign({count:0}) .value()
    res.json({action:"clear", count: jerks.count})
})

//Listen
server.listen(PORT);
console.log('Running on http://localhost:' + PORT);