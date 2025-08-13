const express = require('express');
const router = express.Router();
const responseController = require('../controller/responseController');


router.post('/',responseController.submitResponse);

router.get('/:formId', responseController.getResponses);

module.exports = router;
