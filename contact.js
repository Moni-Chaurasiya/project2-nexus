 const http = require('http')
 const fs = require('fs')
 const fileContent =fs.readFileSync('contact.html')
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname+'/contact.html'));


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "World",
    password: "m@o#n&i!1504MONI",
    port: 15411,
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
  res.writeHead(200,{'Content-type':'text/html'});
  res.end(fileContent)
  
});

app.post('/submit', async (req, res) => {
  const { name, email, message, telephone,rating } = req.body;

  try {
   
    const result = await pool.query(
      'INSERT INTO contacts (name, email, message, tel, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, message, telephone, rating]
    );

 
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error inserting data into PostgreSQL:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
