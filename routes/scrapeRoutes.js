const express = require("express");
const scrapedData = require("../controller/scrapeController");

const router = express.Router();

// Scraper Route
router.get("/api/scraped", scrapedData);

module.exports = router;
