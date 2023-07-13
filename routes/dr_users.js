var express = require('express');
var router = express.Router();
var db  = require('../config/db');


// display user page
router.get('/list', (req, res)=> {
    db.query('SELECT * FROM dr_users ORDER BY id asc',function(err,rows) {
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

  
// Create a new user
router.post('/add', (req, res) => {
    const {
        f_name,
        l_name,
        phone_no,
        email,
        address,
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
    console.log("here in delete");
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


module.exports = router;