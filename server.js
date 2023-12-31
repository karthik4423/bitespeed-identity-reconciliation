const express = require('express');
const indexRouter = require('./routes/index');
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}!`));

app.use('/', indexRouter);
