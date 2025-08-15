const Form = require('../models/formSchema');
const Question = require('../models/questionSchema');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');

// ✅ Get all forms
exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find().populate('questions');
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single form by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('questions');
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create a form
exports.createForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
console.log(req.body,"before")
    let headerImage = null;
  try {
  if (typeof questions === "string") {
    questions = JSON.parse(questions);
  }
} catch (err) {
  return res.status(400).json({ message: "Invalid questions format" });
}

console.log(req.body,"after")
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'forms' },
        (error, uploadResult) => {
          if (error) {
            return res.status(500).json({ message: 'Image upload failed', error });
          }
          headerImage = uploadResult.secure_url;
        }
      );
      result.end(req.file.buffer);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    for (let id of questions) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: `Invalid question ID: ${id}` });
      }
      const exists = await Question.findById(id);
      if (!exists) {
        return res.status(400).json({ message: `Question not found: ${id}` });
      }
    }

    let newForm = new Form({ title, description, headerImage, questions });
    newForm = await newForm.save();

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    newForm.shareableLink = `${baseUrl}/forms/${newForm._id}`;
    await newForm.save();

    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Update a form
exports.updateForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
 if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'forms' },
        (error, uploadResult) => {
          if (error) {
            return res.status(500).json({ message: 'Image upload failed', error });
          }
          updateData.headerImage = uploadResult.secure_url;
        }
      );
      result.end(req.file.buffer);
    }

    if (questions) {
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Questions array is required' });
      }
      for (let id of questions) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: `Invalid question ID: ${id}` });
        }
        const exists = await Question.findById(id);
        if (!exists) {
          return res.status(400).json({ message: `Question not found: ${id}` });
        }
      }
      updateData.questions = questions;
    }

    const updatedForm = await Form.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('questions');
    if (!updatedForm) return res.status(404).json({ message: 'Form not found' });

    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Delete a form
exports.deleteForm = async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
