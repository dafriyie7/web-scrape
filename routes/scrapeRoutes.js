const express = require("express");
const scrape = require("../controller/scrapeController")

const router = express.Router();

// GET all workouts (Scraper route)
router.get("/api/scraped", scrape);

module.exports = router;
