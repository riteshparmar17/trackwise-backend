const express = require('express');
const auth = require('../middleware/auth.middleware');
const { getLookups, createLookup, updateLookup, deleteLookup } = require('../controllers/lookup.controller');
const router = express.Router();

router.get('/', auth(), getLookups);
router.post('/', auth(), createLookup);
router.put('/:id', auth(), updateLookup);
router.delete('/:id', auth(), deleteLookup);

module.exports = router;