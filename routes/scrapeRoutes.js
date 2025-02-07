const express = require("express");
const scrapedData = require("../controller/scrapeController")

const router = express.Router();

// GET all workouts (Scraper route)
router.get("/api/scraped", scrapedData);

module.exports = router;
