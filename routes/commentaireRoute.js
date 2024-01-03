const express = require('express');
const router = express.Router();


const commentaireController = require('../controllers/commentaireController');
const { authenticator } = require('../middleware/authMiddleware');
const { isAdminOrJournalist } = require('../middleware/authMiddleware');


router.use(authenticator);
router.post('/', isAdminOrJournalist, commentaireController.createComment);
router.get('/', commentaireController.getAllComments);
module.exports = router;
