const express = require('express');
// path is a built-in Node.js package
const path = require('path');
const notesDb = require('./db/notes.json')

//initialized express
const app = express();

//express runs on specified port
const PORT = 3001;

//static middleware pointing to the public folder
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//linking static files to the server
app.get('/index', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//get request for all notes
app.get('/api/database', (req, res) => {
    console.info(`${req.method} request received to get notes`)
    return res.json(notesDb)
});

//post request to add a note
app.post('/api/database', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    let response;

    if (req.body && req.body.title) {
        response = {
            data: req.body
        }
    }
    res.json(response)
})

//listen() listens for incoming connections on the specified port
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
