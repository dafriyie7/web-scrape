const express = require("express");
const puppeteer = require("puppeteer");

const router = express.Router();

// GET all workouts (Scraper route)
router.get("/", async (req, res) => {
  try {
    const url = "https://jiji.com.gh/agriculture-and-foodstuff";

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for cloud deployment
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector(".b-list-advert__gallery__item");

    let products = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".b-list-advert__gallery__item")
      ).map((product) => {
        const link = product.querySelector("a")?.href || "N/A";
        const locationMatch = link.match(/jiji\.com\.gh\/([^/]+)/);
        const location = locationMatch
          ? locationMatch[1].replace(/-/g, " ")
          : "N/A";

        let priceText =
          product.querySelector(".qa-advert-price")?.textContent.trim() ||
          "N/A";
        let price = parseFloat(priceText.replace(/[^\d]/g, "")) || 0; // Removes non-numeric characters

        return {
          name:
            product
              .querySelector(".b-advert-title-inner")
              ?.textContent.trim() || "N/A",
          priceText,
          price,
          description:
            product
              .querySelector(".b-list-advert-base__description-text")
              ?.textContent.trim() || "N/A",
          image: product.querySelector("img")?.src || "N/A",
          location,
          link,
        };
      });
    });

    products = products.filter((item) => item.price > 0);
    products.sort((a, b) => a.price - b.price);

    await browser.close();

    // ✅ Send JSON response
    res.json({ success: true, products });
  } catch (error) {
    console.error("Scraping error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Scraping failed",
        error: error.message,
      });
  }
});

module.exports = router;
