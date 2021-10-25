require('dotenv').config(); //import dotenv for process.env setup
require('./data/index.data');

const express = require('express');
const indexRouter = require('./routes/index.routes');
const authRouter = require('./routes/auth.routes');
const portfolioRouter = require('./routes/portfolio.routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors); //CORS HTTP header
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // to get cookies from request

// Routes
app.use(indexRouter); //index router for '/'
app.use(authRouter); // auth router for '/register'
app.use(portfolioRouter); //router to add and get portfolio data

app.listen(PORT, (error) => {
  if (error) {
    console.error(error.message);
    return;
  }

  console.log(`CHECK http://localhost:${PORT}`);
});
