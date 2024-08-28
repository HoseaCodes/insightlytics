// /pages/api/scraper.js

// import * as cheerio from 'cheerio';

async function scrapeNewBusinesses(url) {
  const response = await fetch(url);
  const html = await response.text();

//   const $ = cheerio.load(html); // Load HTML with Cheerio

  const businesses = [];

//   $('.business-listing').each((index, element) => {
//     const name = $(element).find('.business-name').text().trim();
//     const address = $(element).find('.business-address').text().trim();
//     const website = $(element).find('.business-website').text().trim();

//     if (!website) { // Filter out businesses with websites
//       businesses.push({ name, address });
//     }
//   });

  return businesses;
}

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const businesses = await scrapeNewBusinesses(url);
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape data' });
  }
}
