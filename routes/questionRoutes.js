const express = require('express');
const router = express.Router();
const questionController = require('../controller/questionController');
const upload = require('../middleware/upload');


router.get('/', questionController.getAllQuestions);

router.get('/:id', questionController.getQuestionById);


router.post('/', upload.single('image'), questionController.createQuestion);

router.put('/:id', upload.single('image'), questionController.updateQuestion);

router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
