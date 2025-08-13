const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },       
  description: String,                           
  headerImage: String,                           

  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],

  createdBy: { type: String },            
  Link: { type: String }       
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
