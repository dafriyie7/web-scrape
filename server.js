require("dotenv").config();
const express = require("express");
const scrapeRoutes = require("./routes/scrapeRoutes");

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Handle favicon request
app.get("/favicon.ico", (req, res) => res.status(204));

// Redirect root to /api/scraped
app.get("/", (req, res) => {
  res.redirect("/api/scraped");
});

// Routes
app.use("/", scrapeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
