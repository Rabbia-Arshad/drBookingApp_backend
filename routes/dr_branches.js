var express = require('express');
var router = express.Router();
var db  = require('../config/db');

// Fetch list of branches of individual branches
router.get('/list/:id', (req, res) => {
    const { id } = req.params;
    console.log("here")
    db.query('SELECT * FROM dr_branches WHERE dr_id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Availability not found' });
      } else {  
        res.json(results);
      }
    });
});


// Add Branch
router.post('/add', (req, res) => {
    const {dr_id, name, address, lat, lng  } = req.body;
  
    const branch = {
        dr_id, 
        name, 
        address,
        lat, 
        lng
    };
  
    db.query('INSERT INTO dr_branches SET ?', branch, (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else {
        res.status(201).json({ message: 'Branch Added successfully' });
      }
    });
});


//Update Branch detail
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { dr_id, name, address, lat, lng} = req.body;
   
    const branch = {
      dr_id, 
      name, 
      address,
      lat, 
      lng
    };
  
    db.query('UPDATE dr_branches SET ? WHERE id = ?', [branch, id], (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Branch not found' });
      } else {
        res.json({ message: 'Branch updated successfully' });
      }
    });
});



// Delete branch
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM dr_branches WHERE id = ?', [id], (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Branch not found' });
      } else {
        res.json({ message: 'Branch deleted successfully' });
      }
    });
});
  

module.exports = router;