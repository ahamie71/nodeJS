const express = require('express');
const express = require('express');
const router = express.Router();
const isAdmin = require('./authMiddleware'); // Assure-toi d'importer correctement le middleware isAdmin
const technologieController = require('../controllers/technoController');

router.get('/', isAdmin, technologieController.getAllTechnologies);
router.get('/:id', isAdmin, technologieController.getTechnologyById);
router.post('/', isAdmin, technologieController.createTechnology);
router.put('/:id', isAdmin, technologieController.updateTechnologyById);
router.delete('/:id', isAdmin, technologieController.deleteTechnologyById);

module.exports = router;
