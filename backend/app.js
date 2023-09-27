
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
    port: process.env.DB_PORT || 3306,
    database: 'notes'
});

const db = dbPool.promise();



async function RecreateTables() {//DropTables() {
    try {
        await db.execute('DROP TABLE IF EXISTS notes');
        console.log('Table dropped successfully');
        CreateTables()
    } catch (e) {
        console.error('Error dropping table:', e);
    }
}
async function CreateTables() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS notes (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                color VARCHAR(255) NOT NULL,
                note TEXT NOT NULL,
                rotation INT DEFAULT 0,
                xFraction FLOAT,
                yFraction FLOAT
            );
        `);
        console.log('Table created successfully');
    } catch (e) {
        console.error('Error creating table:', e);
    }
}


const PORT = 8080;
CreateTables();

    
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


if (process.env.DEV == 1){
    app.get('/DeleteDatabase', async (req, res) => {
        console.log("deleting database");
        RecreateTables();
    });
}




app.get('/getNotes', async (req, res) => {
    //console.log("getting notes");
    try {
        const [rows] = await db.query('SELECT * FROM notes');
        return res.send(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).send({error: 'Error'});
    }
});





app.post('/addNote', async (req, res) => {
    const { title, color, note, rotation} = req.body;
    // Check for missing or empty values
    if (!title || !color || !note || !rotation) {
        //return res.send({ error: 'Title, color, and note are required fields.' })
        return res.status(500).json({ error: 'Title, color, and note are required fields.' });
    }
    try {
        await db.execute('INSERT INTO notes (note, title, color, rotation) VALUES (?, ?, ?, ?)', [note, title, color, rotation]);
        const [rows] = await db.query('SELECT * FROM notes');
        return res.send(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).send({error: 'Error'});
    }
});



app.post('/editTitle', async (req, res) => {
    const { title, id} = req.body;
    // Check for missing or empty values
    if (!title || !id) {
        return res.status(500).json({ error: 'Title and id are required fields.' });
    }
    try {
        await db.execute('UPDATE notes SET title = ? WHERE id = ?', [title, id]);
        const [rows] = await db.query('SELECT * FROM notes');
        return res.send(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).send({error: 'Error'});
    }
});


app.post('/editContent', async (req, res) => {
    const { content, id} = req.body;
    // Check for missing or empty values
    if (!content || !id) {
        return res.status(500).json({ error: 'Content and id are required fields.' });
    }
    try {
        await db.execute('UPDATE notes SET note = ? WHERE id = ?', [content, id]);
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


app.post('/moveNote', async (req, res) => {
    const { id, xFraction, yFraction } = req.body;
    if (!id || !xFraction || !yFraction ) {
        return res.status(400).json({ error: 'id, xFraction, and yFraction are required fields.' });
    }
    try {
        await db.execute('UPDATE notes SET xFraction = ?, yFraction = ? WHERE id = ?', [xFraction, yFraction, id]);
        res.sendStatus(200); // Respond with a success status
    } catch(e) {
        console.error(e);
        return res.status(500).send({error: 'Error'});
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
