const Question = require('../models/questionSchema');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const {
      type,
      categorize,
      clozeText,
      options,
      correctAnswers,
      passage,
      subQuestions,
      description
    } = req.body;

    // Validate question type
    const allowedTypes = ['categorize', 'cloze', 'comprehension'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid question type' });
    }

    let imageUrl = null;
    console.log(req.body);
    console.log(req.file);
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'questions' },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = await uploadPromise;
    }

    const newQuestion = new Question({
      type,
      imageUrl: req.file ? req.file.path : imageUrl || null, 
      categorize,
      clozeText,
      options,
      correctAnswers,
      passage,
      subQuestions,
      description
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const {
      type,
      imageUrl,
      categorize,
      clozeText,
      options,
      correctAnswers,
      passage,
      subQuestions,
      description
    } = req.body;

    const updateData = {};

    if (type) {
      const allowedTypes = ['categorize', 'cloze', 'comprehension'];
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ message: 'Invalid question type' });
      }
      updateData.type = type;
    }

    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'questions' },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
      updateData.imageUrl = await uploadPromise;
    }

    if (categorize) updateData.categorize = categorize;
    if (clozeText) updateData.clozeText = clozeText;
    if (options) updateData.options = options;
    if (correctAnswers) updateData.correctAnswers = correctAnswers;
    if (passage) updateData.passage = passage;
    if (subQuestions) updateData.subQuestions = subQuestions;
    if (description) updateData.description = description;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
