
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

// Global variables
let notes = [];
let noteId = 0;
    
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/getNotes', (req, res) => {
    return res.send(notes);
});



app.post('/addNote', (req, res) => {
    note = req.body;
    notes.push({note: note.note, id: noteId});
    noteId++;
    return res.send(notes);
});


app.get('/removeNote', (req, res) => {
    let id = req.query.id;
    id = parseInt(id);
    notes = notes.filter((note) => note.id !== id);
    return res.send(notes);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
