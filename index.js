const express = require('express');
const mysql = require('mysql2');


// Initialize express app
const app = express();
// const port = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// MySQL connection
const conncection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Saksham@1',
  database: 'school'
});

conncection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;
  
    // Input validation
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const q = 'INSERT INTO school (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    conncection.query(q, [name, address, latitude, longitude], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
  });
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };
  
  app.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;
  
    // Validate inputs
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Valid latitude and longitude are required' });
    }
  
    const q1 = 'SELECT * FROM school';
    conncection.query(q1, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
  
      const schoolsWithDistance = results.map(school => {
        const distance = haversine(latitude, longitude, school.latitude, school.longitude);
        return { ...school, distance };
      });
  
      schoolsWithDistance.sort((a, b) => a.distance - b.distance);
  
      res.status(200).json(schoolsWithDistance);
    });
  });
  

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on ${port}`);
// });
