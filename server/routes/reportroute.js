const exp = require('express');
const Tesseract = require("tesseract.js");
const Pothole = require('../models/Pothole');
const mongoose=require('mongoose');

const router = exp.Router();

router.post('/upload', async (req, res) => {
  try {
    const {submittedBy, location, description, severity, image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image (base64) is required" });
    }

    // Run OCR directly on base64 string
   
const { data: { text } } = await Tesseract.recognize(image, "eng");


    // Regex to find lat/lon
    const latMatch = text.match(/(-?\d{1,2}\.\d{3,})/g);
    const lonMatch = text.match(/(-?\d{2,3}\.\d{3,})/g);

    let latitude = null, longitude = null;
    if (latMatch && lonMatch) {
      latitude = parseFloat(latMatch[0]);
      longitude = parseFloat(lonMatch[1]);
    }

    // Save directly to MongoDB
    const newPothole = new Pothole({
      submittedBy,
      image, // store as base64
      location,
      description,
      severity,
      latitude,
      longitude
    });

    await newPothole.save();

    res.json({ message: "Pothole reported successfully" });
  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).json({ error: "Failed to process image . Try to upload gps image" });
  }
});
router.get("/potholes", async (req, res) => {
  try {
    // Only return latitude and longitude fields
    const potholes = await Pothole.find({}, { latitude: 1, longitude: 1, _id: 0 });

    res.json(potholes); // This will be an array of { latitude, longitude }
  } catch (err) {
    console.error("Error fetching potholes:", err);
    res.status(500).json({ error: "Failed to fetch potholes" });
  }
});


router.get("/pothole/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userId = new mongoose.Types.ObjectId(req.params.id);

    const reported = await Pothole.find({ submittedBy: userId, status: "reported" }).lean();
    const underRepair = await Pothole.find({ submittedBy: userId, status: "in progress" }).lean();
    const finished = await Pothole.find({ submittedBy: userId, status: "completed" }).lean();

    res.json({
      reported: reported.map(p => ({ ...p, id: p._id, mapUrl: `https://www.google.com/maps?q=${p.latitude},${p.longitude}&z=15&output=embed` })),
      underRepair: underRepair.map(p => ({ ...p, id: p._id, mapUrl: `https://www.google.com/maps?q=${p.latitude},${p.longitude}&z=15&output=embed` })),
      finished: finished.map(p => ({ ...p, id: p._id, mapUrl: `https://www.google.com/maps?q=${p.latitude},${p.longitude}&z=15&output=embed` })),
    });

  } catch (err) {
    console.error("Error fetching pothole:", err);
    res.status(500).json({ error: "Failed to fetch pothole" });
  }
});


// Get reported potholes
router.get("/reported", async (req, res) => {
  try {
    const reported = await Pothole.find({ status: "reported" });
    res.json({ success: true, potholes: reported });
  } catch (err) {
    console.error("Error fetching reported potholes:", err);
    res.status(500).json({ success: false, error: "Failed to fetch reported potholes" });
  }
});




// Get assigned & completed potholes for a user
router.get("/pothole/completed/:id", async (req, res) => {
  try {
    const assigned = await Pothole.find({
      status: "in progress",
      assignedTo: req.params.id
    }).populate("submittedBy", "name phone").lean();

    const completed = await Pothole.find({
      status: "completed",
      assignedTo: req.params.id
    }).populate("submittedBy", "name phone").lean();

    res.json({ success: true, assigned, completed });
  } catch (err) {
    console.error("Error fetching completed potholes:", err);
    res.status(500).json({ success: false, error: "Failed to fetch completed potholes" });
  }
});

// Assign pothole
router.put("/pothole/assign/:id", async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const status = "in progress";
    const assignedDate = new Date();

    await Pothole.findByIdAndUpdate(
      req.params.id,
      { assignedTo, status, assignedDate },
      { new: true }
    );

    res.json({ success: true, message: "Pothole assigned successfully" });
  } catch (err) {
    console.error("Error assigning pothole:", err);
    res.status(500).json({ success: false, error: "Failed to assign pothole" });
  }
});

// Mark pothole as complete
router.put("/pothole/complete/:id", async (req, res) => {
  try {
    const status = "completed";
    const dateOfCompletion = new Date();

    await Pothole.findByIdAndUpdate(
      req.params.id,
      { status, dateOfCompletion },
      { new: true }
    );

    res.json({ success: true, message: "Pothole marked as completed" });
  } catch (err) {
    console.error("Error completing pothole:", err);
    res.status(500).json({ success: false, error: "Failed to complete pothole" });
  }
});

module.exports = router;
