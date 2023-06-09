const auth = require("../middleware/auth");
const { tennisCourt, validate } = require("../models/tennisCourt");
const express = require("express");
const router = express.Router();
const checkOverlap = require("../../app/functions/checkOverlap");

router.get("/", async (req, res) => {
  const { startTime, endTime } = req.query;
  try {
    const startTimeDate = startTime;
    const endTimeDate = endTime;

    const tennisCourts = await tennisCourt.find().sort("courtName");

    const availableCourts = tennisCourts.filter((tennisCourt) => {
      return !checkOverlap(startTimeDate, endTimeDate, tennisCourt.bookings);
    });
    if (availableCourts.length === 0) {
      return res
        .status(200)
        .json("No courts available at the selected date and time.");
    } else res.send(availableCourts);
  } catch (error) {
    console.log(error);
  }
});

router.post("/bookings", auth, async (req, res) => {
  const { startTime, endTime, courtId, userId } = req.body;

  try {
    const court = await tennisCourt.findById(courtId);
    if (!court) return res.status(404).send("Could not find the court.");
    court.bookings.push({ startTime, endTime, userId });

    await court.save();
    res.status(200).send("Booking added to court.");
  } catch (error) {
    console.log("Some error in the backend for posting a tennis court");
    console.log(error);
  }
});

module.exports = router;
