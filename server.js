const express = require('express');
const indexRouter = require('./routes/index');
const app = express();

app.listen(3000, () => console.log('listening on port 3000!'));

app.use('/', indexRouter);
