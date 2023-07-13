var express = require('express');
var router = express.Router();
var db  = require('../config/db');
const { route } = require('./dr_users');


//Add Visit
router.post('/add', (req, res) => {
    const { dr_id, pa_id, visit_no, charges, duration } = req.body;
  
    const visits = {
      dr_id,
      pa_id,
      visit_no,
      charges,
      duration,
    };
  
    db.query('INSERT INTO visits SET ?', visits, (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else {
        res.status(201).json({ message: 'Visits record added successfully' });
      }
    });
});


// Get Doctor Visits
router.get('/dr/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM visits WHERE dr_id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'No record found' });
      } else {
        res.json(results[0]);
      }
    });
});


// Get Doctor Visits
router.get('/dr/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM visits WHERE dr_id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'No record found' });
      } else {
        res.json(results);
      }
    });
});


// Get Patient Visits
router.get('/pa/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM visits WHERE pa_id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Something went wrong' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'No record found' });
      } else {
        res.json(results);
      }
    });
});

module.exports = router