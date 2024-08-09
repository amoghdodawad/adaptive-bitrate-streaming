const router = require('express').Router();
const { init, upload, complete} = require('../controllers/uploadController');

router.post('/init',init);
router.post('/upload',upload);
router.post('/complete',complete);

module.exports = router;