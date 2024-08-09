const router = require('express').Router();
const { streamHls } = require('../controllers/hlsController');
router.get('/:videoId/:file',streamHls);
module.exports = router;