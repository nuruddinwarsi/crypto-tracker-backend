require('./data/index.data');

const express = require('express');
const indexRouter = require('./routes/index.routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(indexRouter);
app.use(cors); //CORS HTTP header

app.listen(PORT, (error) => {
  if (error) {
    console.error(error.message);
    return;
  }

  console.log(`CHECK http://localhost:${PORT}`);
});
