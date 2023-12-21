/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors')({origin: true}); // Enable CORS for all origins

// Function to fetch meta tags
exports.fetchMeta = onRequest((request, response) => {
  cors(request, response, async () => {
    const url = request.query.url;
    if (!url) {
      logger.error("URL is required");
      return response.status(400).send('URL is required');
    }

    try {
      const res = await axios.get(url);
      const html = res.data;
      const $ = cheerio.load(html);
      const metaImage = $('meta[property="og:image"]').attr('content');
      const metaTitle = $('meta[property="og:title"]').attr('content') || $('title').text();


      response.json({ image: metaImage, title: metaTitle  });
    } catch (error) {
      logger.error("Error fetching URL:", error);
      response.status(500).send('Error fetching URL');
    }
  });
});


// Here you can add more functions or export existing ones

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
