const Response = require('../models/responseSchema');


exports.submitResponse = async (req, res) => {
  try {
    const { formId, submittedBy, answers } = req.body;

    if (!formId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'formId and answers are required' });
    }

    const response = await Response.create({ formId, submittedBy, answers });
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    const responses = await Response.find({ formId })
      .populate('answers.questionId')
      .sort({ createdAt: -1 });

    res.status(200).json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
