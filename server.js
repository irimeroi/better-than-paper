const express = require('express');
// path is a built-in Node.js package
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid.js')

//initialized express
const app = express();
//express runs on specified port
const PORT = process.env.PORT || 3002;

//static middleware pointing to the public folder
app.use(express.static('public'));
//lines for every app - tell the server we're passing json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//linking static files to the server
//homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);
//notespage
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//get request for all notes
app.get('/api/notes', (req, res) => {
    const notes = require('./db/notes.json');
    fs.readFile('./db/notes.json', 'utf-8', function (err, data) {
        if (err) {
            return err;
        }
        console.log(data);
        res.json(JSON.parse(data));
    })
});

//post request to add a note
app.post('/api/notes', (req, res) => {
    // const notes = require('./db/notes.json');
    fs.readFile('./db/notes.json', 'utf-8', function (err, data) {
        if (err) {
            return err;
        }
        console.log(data);
        const notes = JSON.parse(data);
        // res.json(JSON.parse(data));
        const { title, text } = req.body;
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        notes.push(newNote);
        fs.writeFile('./db/notes.json', JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).end();
                // res.json(notes)
            }
        });
    })
})

app.delete('/api/notes/:id', (req, res) => {
    console.log('Hello')
    fs.readFile('./db/notes.json', 'utf-8', function (err, notes) {
        if (err) {
            return err;
        }
        const filteredNotes = JSON.parse(notes).filter(function (note) {
            if (note.id !== req.params.id) {
                return true;
            } else {
                return false;
            }
        });
        console.log(filteredNotes);
        fs.writeFile('./db/notes.json', JSON.stringify(filteredNotes, null, 2), (err) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).end();
                // res.json(notes)
            }
        });
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

//listen() listens for incoming connections on the specified port
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
