const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/StatsController');

router.post('/', StatsController.crear);
router.put('/:id', StatsController.actualizar);

module.exports = router;