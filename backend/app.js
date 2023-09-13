
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'notes'
});

const db = dbPool.promise();

db.query(
    `CREATE TABLE IF NOT EXISTS notes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        note TEXT NOT NULL
    );`
)

const PORT = 8080;

// Global variables
let notes = [];
let noteId = 0;
    
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/getNotes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notes');
        return res.send(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).send({error: 'Error'});
    }
    
});



app.post('/addNote', async (req, res) => {
    const note = req.body.note;
    try {
        await db.execute('INSERT INTO notes (note) VALUES (?)', [note]);
        const [rows] = await db.query('SELECT * FROM notes');
        return res.send(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).send({error: 'Error'});
    }
    
});


app.get('/removeNote', async (req, res) => {
    try {
        const id = req.query.id;
        await db.execute('DELETE FROM notes WHERE id = ?', [id]);
        const [rows] = await db.query('SELECT * FROM notes');
        return res.send(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).send({error: 'Error'});
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
