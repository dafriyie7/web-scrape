require("dotenv").config();
const PORT = process.env.PORT || 4000;

const express = require("express");
const scrapeRoutes = require("./routes/scrapeRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Redirect /api/scraped → /
app.get("/", (req, res) => {
  res.redirect("/api/scraped");
});

// Routes
app.use("/", scrapeRoutes); // Now your scraper is available at "/"

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
