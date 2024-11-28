const express=require("express");
const app=express();
const {client}=require("pg");
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let client=new Client({
host:`school_management_3hyg.onrender.com`,
port:5432,
user:`school_management_3hyg_user`,
password:`ZhDPmbUlZWvLXAS8lC72pWCv0iNWGhzv`,
database:"school_management_3hyg",
});
client.connect((err)=>{
    if(err){
        console.log(err);
    }else{
    console.log("Connected to database");
    }
});
app.get("/",(req,res)=>{
    res.send("send postman request to server");
});

app.post("/addschool",(req,res)=>{
    let {name,address,latitude,longitude}=req.body;
    console.log(req.body);
    let values=[name,address,latitude,longitude];
  if (!name ||!address||!latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required (name,address,latitude, longitude)'});
  }
  const q="Insert into school(name,address,latitude,longitude)values(?,?,?,?)";
    connection.query(q,values,(err,result)=>{
        if (err) {
            console.error('Error adding school:', err);
            return res.status(500).json({ message: 'Failed to add school.' });
          }
      
          res.status(201).json({ message: 'School added successfully!', schoolId: result.insertId });
        });
    });
    app.get("/listSchools", (req, res) => {
        const { latitude, longitude } = req.query;
      
        if (!latitude || !longitude) {
          return res.status(400).json({ message: "Latitude and longitude are required." });
        }
      
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);
      
        if (isNaN(userLat) || isNaN(userLon)) {
          return res.status(400).json({ message: "Latitude and longitude must be valid numbers." });
        }
      
        const query = "SELECT id, name, address, latitude, longitude FROM school";
        connection.query(query, (err, schools) => {
          if (err) {
            console.error("Error fetching schools:", err);
            return res.status(500).json({ message: "Failed to fetch school" });
          }
      
          const haversineDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = (value) => (value * Math.PI) / 180;
            const R = 6371; // Earth's radius in km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
          };
      
          const sortedSchools = schools
            .map((school) => ({
              ...school,
              distance: haversineDistance(userLat, userLon, school.latitude, school.longitude),
            }))
            .sort((a, b) => a.distance - b.distance);
      
          res.status(200).json(sortedSchools);
        });
      });
      

app.listen(8080, () => {
    console.log("server is listening on port:8080");
});