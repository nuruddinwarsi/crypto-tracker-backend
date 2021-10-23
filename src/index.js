const express = require('express');
const indexRouter = require('./routes/index.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.error(error.message);
    return;
  }

  console.log(`CHECK http://localhost:${PORT}`);
});
