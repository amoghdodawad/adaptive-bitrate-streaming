const express = require('express');
const http = require('http');
const authRouter = require('./routes/authRouter');
const authMiddleware = require('./middleware/authMiddlware');
const proxyMiddleware = require('./proxy/proxy');
const cors = require('cors');
require('dotenv').config();
require('mongoose').connect(process.env.MONGO_URI);

const app = express();

app.use(cors());
app.get('/',express.static('build'));
app.use(authMiddleware);
app.use(proxyMiddleware);
app.use('/auth',authRouter);

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`HTTP reverse proxy server running on port ${PORT}`);
});