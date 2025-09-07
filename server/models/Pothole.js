const mongoose = require('mongoose');

const potholeSchema = new mongoose.Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // reference to User who reported
    required: true,
  },
  image: {
    type: String,  // store image URL or file path
    required: true,
  },
  location:{
    type:String,
    required:true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  description: {
    type: String
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  dateOfSubmission: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["reported", "in progress", "completed"],
    default: "reported",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // reference to Municipality user
  },
  dateOfCompletion: {
    type: Date,
  },
  assignedDate: {
    type: Date,
  },
});


module.exports = mongoose.model('Pothole', potholeSchema);
