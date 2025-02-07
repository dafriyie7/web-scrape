const puppeteer = require("puppeteer");

const scrape = async (req, res) => {
  try {
    const url = "https://jiji.com.gh/agriculture-and-foodstuff";

    // Launch Puppeteer with custom executable path
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector(".b-list-advert__gallery__item");
    await new Promise((resolve) => setTimeout(resolve, 5000));

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
        let price = parseFloat(priceText.replace(/[^\d.]/g, "")) || 0;

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

    products.sort((a, b) => a.price - b.price);

    await browser.close();

    console.log(products);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Scraping error:", error);
    return res.status(500).json({ error: "Scraping failed" });
  }
};

module.exports = scrape;
