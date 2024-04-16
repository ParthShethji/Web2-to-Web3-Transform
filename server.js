// Import necessary libraries
const express = require('express');
const {webScrape, code_generate} = require("./llmCalls")
const bodyParser = require('body-parser');
const cors = require('cors')

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Parse application/json
app.use(bodyParser.json());
app.use(cors())




app.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }
    const data = await webScrape(url);
    res.json({ data });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/generate_code', async (req, res) => {
  try {
    const { approachHeading, approachContent, additionalDetails } = req.body;

    // Call the code_generate function with provided parameters
    const generatedCode = await code_generate(approachHeading, approachContent, additionalDetails);

    // Respond with the generated code
    res.json({ generatedCode });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'An error occurred while generating code.' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
