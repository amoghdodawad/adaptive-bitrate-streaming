const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authMiddleware(req, res, next){
    try {
        if(req.url.startsWith('/upload')){
            if(!req.headers['authorization']){
                return res.status(403).json({ message: 'Unauthorized', success: false });
            }
            const token = req.headers['authorization'].split(' ')[1];
            await new Promise((resolve, reject) => {
                jwt.verify(token,process.env.JWT_SECRET, (err, user) => {
                    if(err) reject('err');
                    req.headers.uploadedBy = user.email;
                    resolve();
                })
            });
        }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized', success: false });
    }
}

module.exports = authMiddleware