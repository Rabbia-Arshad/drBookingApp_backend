var express = require('express');
var router = express.Router();
var db  = require('../config/db');


// Fetch popular doctors based on reviews and ratings
router.get('/popular_doctors/list', (req, res) => {
    const popularDoctorsQuery = `
      SELECT dr_users.*, COUNT(rating_reviews.id) AS review_count, AVG(rating_reviews.rating) AS avg_rating
      FROM dr_users
      LEFT JOIN rating_reviews ON dr_users.id = rating_reviews.dr_id
      GROUP BY dr_users.id
      HAVING review_count >= 10 AND avg_rating >= 4.0
      ORDER BY review_count DESC, avg_rating DESC
      LIMIT 10;
    `;
  
    db.query(popularDoctorsQuery, (error, popularDoctors) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else {
            res.status(200).send({
            message: "Data fetched successfully",
            data: popularDoctors
            });
            // res.json(popularDoctors);
        }
    });
});


// Get list of all doctors
router.post('/list', (req, res)=> {
    const { search } = req.body;
    var query = `SELECT dr.*, COUNT(rating_reviews.id) AS review_count, AVG(rating_reviews.rating) AS avg_rating
                FROM dr_users dr
                LEFT JOIN rating_reviews ON dr.id = rating_reviews.dr_id
                `
    var where = "";
    if (search !== null && search !== undefined){
        where = ` WHERE dr.f_name LIKE ('%${search}%')`;
        where += ` OR dr.l_name LIKE ('%${search}%')`;
        where += ` OR dr.address LIKE ('%${search}%')`;
        where += ` OR dr.profession LIKE ('%${search}%')`;
        where += ` OR dr.hospital LIKE ('%${search}%')`;
    }          
    
    query =  query + where + ' GROUP BY dr.id  ORDER BY review_count DESC, avg_rating DESC'
    db.query(query, function(err,rows) {
        if(err) {
            res.status('err',err);   
        } else {
            res.status(200).send({
            message: "Data fetched successfully",
            data: rows
            });
        }
    });
});


// Get a specific user
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM dr_users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Something went wrong' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
});


// Get a specific user on basis of Phone-No
router.post('/auth', (req, res) => {
    const { phone_no } = req.body;
    db.query('SELECT * FROM dr_users WHERE phone_no = ?', [phone_no], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Something went wrong' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
});

  
// Create a new user
router.post('/add', (req, res) => {
    const {
        f_name,
        l_name,
        phone_no,
        email,
        address,
        lat,
        lng,
        gender,
        profession,
        hospital,
        experience,
        fee,
    } = req.body;
    
    const user = {
        f_name,
        l_name,
        phone_no,
        email,
        lat,
        lng,
        address,
        gender,
        profession,
        hospital,
        experience,
        fee
    };
    
    db.query('INSERT INTO dr_users SET ?', user, (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Something went wrong' });
        } else {
            res.status(201).json({ message: 'User created successfully', id: result.insertId });
        }
    });
});


// Update an existing user
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const {
        f_name,
        l_name,
        phone_no,
        email,
        address,
        lat,
        lng,
        gender,
        profession,
        hospital,
        experience,
        fee,
    } = req.body;
    
    
    const user = {
        f_name,
        l_name,
        phone_no,
        email,
        address,
        lat,
        lng,
        gender,
        profession,
        hospital,
        experience,
        fee
    };
    
    db.query('UPDATE dr_users SET ? WHERE id = ?', [user, id], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Something went wrong' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User updated successfully' });
        }
    });
});


// Delete a user
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM dr_users WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Something went wrong' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
});


// Fetch doctor details from dr_users table
router.get('/detail/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM dr_users WHERE id = ?', [id], (error, drResults) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else if (drResults.length === 0) {
        res.status(404).json({ error: 'Doctor not found' });
      } else {
        const doctor = drResults[0];
  
        // Fetch count of rating reviews and average rating from rating_reviews table
        db.query('SELECT COUNT(*) AS review_count, AVG(rating) AS avg_rating FROM rating_reviews WHERE dr_id = ?', [id], (error, ratingResults) => {
          if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Something went wrong' });
          } else {
            doctor.review_count = ratingResults[0].review_count;
            doctor.avg_rating = ratingResults[0].avg_rating || 0;
  
            // Fetch sum of earnings from earnings table
            db.query('SELECT SUM(charges) AS total_earning FROM earnings WHERE dr_id = ?', [id], (error, earningResults) => {
              if (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Something went wrong' });
              } else {
                doctor.total_earning = earningResults[0].total_earning || 0;
  
                // Fetch upcoming visits from visits table with day and time greater than current date and time
                const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert to MySQL datetime format
                console.log("currentDate1", currentDate)
                db.query('SELECT * FROM visits WHERE dr_id = ? AND is_done = 0 AND is_rejected = 0 AND start_date_time > ?', [id, currentDate], (error, visitResults) => {
                  if (error) {
                    console.error('Error executing query:', error);
                    res.status(500).json({ error: 'Something went wrong' });
                  } else {
                    doctor.upcoming_visits = visitResults;
  
                    res.json(doctor);
                  }
                });
              }
            });
          }
        });
      }
    });
});


router.get('/profession/list', (req, res) => {
    const query = 'SELECT DISTINCT profession FROM dr_users';
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else {
        const doctorsByProfession = {};
  
        // Fetch data for each unique profession type
        results.forEach((result) => {
          const profession = result.profession;
          const professionQuery = 'SELECT * FROM dr_users WHERE profession = ?';
  
          db.query(professionQuery, [profession], (error, professionResults) => {
            if (error) {
              console.error('Error executing query:', error);
              res.status(500).json({ error: 'Something went wrong' });
            } else {
              doctorsByProfession[profession] = professionResults;
  
              // Check if all unique profession types have been fetched
              if (Object.keys(doctorsByProfession).length === results.length) {
                res.json(doctorsByProfession);
              }
            }
          });
        });
      }
    });
});
  

module.exports = router;