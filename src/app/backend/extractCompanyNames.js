//server to extract company names
// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer')
const csv = require('csv-parser')
const streamifier = require('streamifier')

const app = express();
const PORT = process.env.PORT || 5000;

// Set up multer to handle file uploads (store in memory or disk)
const storage = multer.memoryStorage(); // or use diskStorage
const upload = multer({ storage });

// Middleware
app.use(cors());
//app.use(express.json()); // Parses application/json


// POST endpoint to extract company names
app.post('/extractCompanyNames', upload.single('file'), (req, res) => {
   
  //const body = req.body;
  //console.log("body in server endpoint is:", body);

  const companyNames = [];

  streamifier.createReadStream(req.file.buffer)
    .pipe(csv())
    .on('data', (row) => {
      // Extract the first column value (assuming CSV columns are ordered)
      const firstColumn = Object.values(row)[0];
      if (firstColumn) {
        companyNames.push(firstColumn);
      }
    })
    .on('end', () => {
      console.log('Extracted company names:', companyNames);
      res.status(200).json({ companyNames });
    })
    .on('error', (err) => {
      console.error('Error parsing CSV:', err);
      res.status(500).json({ error: 'Failed to parse CSV' });
    });

  //res.status(200).json("working fine")


});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
