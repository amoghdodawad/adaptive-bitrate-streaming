const express = require('express');
const http = require('http');
const authRouter = require('./routes/authRouter');
const authMiddleware = require('./middleware/authMiddlware');
const proxyMiddleware = require('./proxy/proxy');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('mongoose').connect(process.env.MONGO_URI);

const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(cors());
app.use('/',express.static('build'));
app.use(authMiddleware);
app.use(proxyMiddleware);
app.use('/auth',authRouter);
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
});

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`HTTP reverse proxy server running on port ${PORT}`);
});