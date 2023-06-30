//this file is for scraping the name & price of ALL wines from the NLC website.
//could potentially filter to 750ml bottles and add more logic to try and sort through red and white to limit amoutn of JSON data.

const puppeteer = require("puppeteer");
const fs = require("fs");

const baseUrl = `https://nlliquor.com/product-category/wine/`;
const outputFilePath = "wineData.json";

const scraper = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Increase timeout to 60 seconds
  page.setDefaultTimeout(60000);

  let wineInfo = [];

  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const pageUrl = `${baseUrl}page/${currentPage}/`;

    await page.goto(pageUrl);

    const currentPageWineInfo = await page.evaluate(() => {
      const wineElements = document.querySelectorAll(
        ".site-main .products.columns-4 li"
      );

      const wineInfo = [];

      for (let i = 0; i < wineElements.length; i++) {
        const wineNameElement = wineElements[i].querySelector(
          ".woocommerce-loop-product__title"
        );
        const winePriceElement = wineElements[i].querySelector(".price");

        const wineName = wineNameElement.innerText;
        const winePrice = winePriceElement.innerText;

        wineInfo.push({
          name: wineName,
          price: winePrice,
        });
      }

      return wineInfo;
    });

    wineInfo.push(...currentPageWineInfo);

    const nextButton = await page.$(".next");
    hasNextPage = nextButton !== null;

    if (hasNextPage) {
      currentPage++;
    }
  }

  // Load existing data if the file exists
  if (fs.existsSync(outputFilePath)) {
    const existingData = fs.readFileSync(outputFilePath);
    const parsedData = JSON.parse(existingData);
    wineInfo = parsedData.concat(wineInfo);
  }

  const jsonData = JSON.stringify(wineInfo, null, 2);
  fs.writeFileSync(outputFilePath, jsonData);

  console.log("Data saved to wineData.json");
  await browser.close();
};

scraper();
