const express = require("express");
const bodyParser = require("body-parser");
const drUsersRouter = require('./routes/dr_users');
const paUsersRouter = require('./routes/pa_users');
const ratingReviewsRouter = require('./routes/rating_reviews');
const notificationsRouter = require('./routes/notifications');
const visitsRouter = require('./routes/visits');
const earningsRouter = require('./routes/earnings');

const app = express();

// Middleware
app.use(bodyParser.json());

app.use('/drUsers', drUsersRouter);
app.use('/paUsers', paUsersRouter);
app.use('/reviews', ratingReviewsRouter);
app.use('/notifications', notificationsRouter);
app.use('/visits', visitsRouter);
app.use('/earnings', earningsRouter);

// PORT
const port = process.env.PORT || 3000;

// define a root route
app.get('/', (req, res) => {
    res.send("Hello Welcome to Booking App Backend");
  });

// Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});