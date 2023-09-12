
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

// Global variables
const notes = [];
    
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/getNotes', (req, res) => {
    console.log("getNotes");
    return res.send(notes);
});



app.post('/addNote', (req, res) => {
    form = req.body;
    if (typeof(form.note) == "string") {
        notes.push(form.note);
    }
    return res.send(notes);
});


app.post('/removeNote', (req, res) => {
    form = req.body;
    if (typeof(form.index) == "number") {
		notes.splice(form.index, 1);
    }
    return res.send(notes);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
