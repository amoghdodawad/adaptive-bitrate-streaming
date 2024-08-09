const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const uploadRouter = require('./routes/uploadRoute');
dotenv.config();
require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('Connected'))
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(express.json());
app.use('/upload',uploadRouter);

app.listen(PORT,() => {
    console.log(`Listening on port ${PORT}`);
});