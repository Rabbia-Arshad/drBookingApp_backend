
// const express = require('express');
// const bodyParser = require('body-parser');
// const usersRouter = require('./routes/dr_users');

// // create express app
// const app = express();

// // Setup server port
// const port = process.env.PORT || 5000;
// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))
// // parse requests of content-type - application/json
// app.use(bodyParser.json())


// app.use('/users', usersRouter);

// // define a root route
// app.get('/', (req, res) => {
//   res.send("Hello World");
// });

// // listen for requests
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });