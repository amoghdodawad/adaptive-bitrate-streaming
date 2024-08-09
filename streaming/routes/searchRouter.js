const router = require('express').Router();
const { search, searchByChannel, searchByVideoId } = require('../controllers/searchController');
router.post('/',search);
router.post('/channel',searchByChannel);
router.get('/video/:videoId',searchByVideoId);
module.exports = router;