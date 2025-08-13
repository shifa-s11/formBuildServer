const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },

  submittedBy: { 
    type: String 
  },

  answers: [{
    questionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Question',
      required: true
    },
    answer: mongoose.Schema.Types.Mixed 
  }],

}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);
