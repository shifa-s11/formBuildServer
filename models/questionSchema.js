const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['categorize', 'cloze', 'comprehension']
  },

imageUrl: String, 
description: String,
isRequired: 
{ type: Boolean, 
default: false },
  // Categorize
  categorize: [{
    name: String,       
    items: [String]     
  }],

  // Cloze 
  clozeText: String,      
  options: [String],      
  correctAnswers: [String], 

  // Comprehension
  passage: String,      
  subQuestions: [{
    question: String,     
    options: [String],    
    correctAnswer: String
  }]

}, { timestamps: true });

QuestionSchema.pre('validate', function (next) {
  if (this.type === 'categorize') {
    if (!this.categorize || this.categorize.length === 0) {
      return next(new Error('Categorize questions must have at least one bucket'));
    }
  }
  if (this.type === 'cloze') {
    if (!this.clozeText || !this.options || !this.correctAnswers) {
      return next(new Error('Cloze questions must have clozeText, options, and correctAnswers'));
    }
  }
  if (this.type === 'comprehension') {
    if (!this.passage || !this.subQuestions || this.subQuestions.length === 0) {
      return next(new Error('Comprehension questions must have a passage and subQuestions'));
    }
  }
  next();
});

module.exports = mongoose.model('Question', QuestionSchema);
