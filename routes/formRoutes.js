const express = require('express');
const router = express.Router();
const formController = require('../controller/formController');
const upload = require('../middlewares/upload');

router.get('/', formController.getAllForms);

router.get('/:id', formController.getFormById);

router.post('/', upload.single('headerImage'), formController.createForm);

router.put('/:id', upload.single('headerImage'), formController.updateForm);

router.delete('/:id', formController.deleteForm);

module.exports = router;
