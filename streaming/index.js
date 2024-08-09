const express = require('express');
const hlsRouter = require('./routes/hlsRouter');
const searchRouter = require('./routes/searchRouter');
const cors = require('cors');
require('dotenv').config();
require('mongoose').connect(process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json());

app.use('/hls',hlsRouter);
app.use('/search',searchRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});