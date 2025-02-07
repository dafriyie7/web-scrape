require("dotenv").config();
const PORT = process.env.PORT || 4000;

const express = require("express");
const scrapeRoutes = require("./routes/scrapeRoutes");

const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/scraped", scrapeRoutes);

// listen to port
    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    })