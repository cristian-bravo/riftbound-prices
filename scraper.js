const fs = require("fs");
const puppeteer = require("puppeteer");

const BASE_URL =
  "https://www.tcgplayer.com/search/riftbound-league-of-legends-trading-card-game/product";
const SEARCH_URL =
  `${BASE_URL}?productLineName=riftbound-league-of-legends-trading-card-game&view=grid`;
const PAGE_SIZE_FALLBACK = 24;
const PAGE_LIMIT_FALLBACK = 200;

function normalizeBlock(text) {
  return (text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function parseMoney(value) {
  if (!value) {
    return 0;
  }

  const parsed = Number.parseFloat(value.replace(/[$,]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (!/[",\n]/.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
}

function buildPageUrl(pageNumber) {
  return `${SEARCH_URL}&page=${pageNumber}`;
}

function isExpectedResultsPage(url) {
  return url.startsWith(BASE_URL);
}

function parseTotalResults(summaryText) {
  const match = summaryText.match(/([\d,]+)\s+results in/i);

  if (!match) {
    return null;
  }

  const total = Number.parseInt(match[1].replace(/,/g, ""), 10);
  return Number.isFinite(total) ? total : null;
}

function parseMaxPaginationPage(pageNumbers) {
  const numericPages = (pageNumbers || [])
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (numericPages.length === 0) {
    return null;
  }

  return Math.max(...numericPages);
}

function extractCardFromText(blockText, updatedAt) {
  const text = normalizeBlock(blockText);

  if (!text) {
    return null;
  }

  const lines = text.split("\n");
  const numberLineIndex = lines.findIndex((line) => /#[A-Za-z0-9/-]+/.test(line));

  if (numberLineIndex < 2) {
    return null;
  }

  const set = lines[0] || "";
  const rarity = (lines[numberLineIndex - 1] || "").replace(/,\s*$/, "").trim();
  const numberMatch = text.match(/#[A-Za-z0-9/-]+/);
  const number = numberMatch ? numberMatch[0] : "";
  const name = (lines[numberLineIndex + 1] || "").trim();
  const listingsMatch = text.match(/(\d+)\s+listings?\s+from/i);
  const standalonePriceLine = lines.find((line) => /^\$[\d,]+(?:\.\d{2})?$/.test(line));
  const marketPriceMatch = text.match(/Market Price:\$([\d,]+(?:\.\d{2})?)/i);
  const availability = /Out of Stock/i.test(text) ? "Out of Stock" : "Available";
  const listings = listingsMatch
    ? Number.parseInt(listingsMatch[1], 10)
    : 0;
  const marketPrice = marketPriceMatch ? parseMoney(marketPriceMatch[1]) : 0;
  const price = standalonePriceLine
    ? parseMoney(standalonePriceLine)
    : marketPrice;

  if (!set || !rarity || !number || !name) {
    return null;
  }

  return {
    name,
    set,
    rarity,
    number,
    listings: Number.isFinite(listings) ? listings : 0,
    price,
    marketPrice,
    availability,
    updatedAt,
  };
}

function toCsv(cards) {
  const header = [
    "name",
    "set",
    "rarity",
    "number",
    "listings",
    "price",
    "marketPrice",
    "availability",
    "updatedAt",
  ];

  const rows = cards.map((card) => [
    card.name,
    card.set,
    card.rarity,
    card.number,
    card.listings,
    card.price,
    card.marketPrice,
    card.availability,
    card.updatedAt,
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
}

async function extractPageData(page, pageNumber) {
  await page.goto(buildPageUrl(pageNumber), {
    waitUntil: "networkidle2",
    timeout: 120000,
  });

  if (!isExpectedResultsPage(page.url())) {
    return {
      redirected: true,
      totalResults: null,
      blocks: [],
    };
  }

  await page.waitForSelector("div.search-result", {
    timeout: 30000,
  });

  return page.evaluate(() => {
    const summaryText = document.body.innerText;
    const blocks = Array.from(document.querySelectorAll("div.search-result")).map(
      (el) => ({
        href: el.querySelector('a[href*="/product/"]')?.href || "",
        text: el.innerText || "",
      })
    );
    const paginationNumbers = Array.from(
      document.querySelectorAll('a[href*="page="], button')
    )
      .map((el) => el.innerText.trim())
      .filter((text) => /^\d+$/.test(text));

    return {
      redirected: false,
      totalResultsText: summaryText,
      blocks,
      paginationNumbers,
    };
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    const updatedAt = new Date().toISOString();
    const uniqueCards = new Map();

    const firstPage = await extractPageData(page, 1);

    if (firstPage.redirected) {
      throw new Error("TCGPlayer redirected the search before results could be read.");
    }

    const firstPageBlocks = firstPage.blocks.filter((block) => block.href);
    const totalResults =
      parseTotalResults(firstPage.totalResultsText || "") || firstPageBlocks.length;
    const pageSize = firstPageBlocks.length || PAGE_SIZE_FALLBACK;
    const detectedPaginationPage =
      parseMaxPaginationPage(firstPage.paginationNumbers || []);
    const calculatedPagesFromResults = Math.ceil(totalResults / pageSize);
    const totalPages = Math.max(
      1,
      Math.min(
        Math.max(calculatedPagesFromResults, detectedPaginationPage || 0),
        PAGE_LIMIT_FALLBACK
      )
    );

    console.log(
      [
        "Verificacion inicial:",
        `resultados=${totalResults}`,
        `cardsPorPagina=${pageSize}`,
        `paginasPorResultados=${calculatedPagesFromResults}`,
        `paginasPorPaginacion=${detectedPaginationPage || "no-detectada"}`,
        `paginasFinales=${totalPages}`,
      ].join(" ")
    );

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      const pageData = pageNumber === 1
        ? firstPage
        : await extractPageData(page, pageNumber);

      if (pageData.redirected) {
        console.log(`Paginacion detenida: pagina ${pageNumber} redirigio fuera del search.`);
        break;
      }

      const pageBlocks = pageData.blocks.filter((block) => block.href);

      if (pageBlocks.length === 0) {
        console.log(`Paginacion detenida: pagina ${pageNumber} sin resultados validos.`);
        break;
      }

      let pageAdded = 0;

      for (const block of pageBlocks) {
        const card = extractCardFromText(block.text, updatedAt);

        if (!card) {
          continue;
        }

        const dedupeKey = `${card.name}::${card.number}`;

        if (uniqueCards.has(dedupeKey)) {
          continue;
        }

        uniqueCards.set(dedupeKey, card);
        pageAdded += 1;
      }

      console.log(
        `Pagina ${pageNumber}/${totalPages}: ${pageAdded} cartas agregadas, total ${uniqueCards.size}`
      );
    }

    const cards = Array.from(uniqueCards.values());
    const csv = toCsv(cards);

    fs.writeFileSync("cards.csv", csv, "utf8");

    console.log(`Cartas guardadas: ${cards.length}`);
  } finally {
    await browser.close();
  }
})();
