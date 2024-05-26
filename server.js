// Import necessary libraries
const express = require('express');
const {webScrape, code_generate} = require("./llmCalls")
const bodyParser = require('body-parser');
const cors = require('cors')

// Create an Express app
const app = express();
const PORT = 3000;

// Parse application/json
app.use(express.json());
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

    // console.log(req.body)
    const { approach_heading, approach_content, user_approach } = req.body;

    // Call the code_generate function with provided parameters
    const generatedCode = await code_generate(approach_heading, approach_content, user_approach);

    // console.log(approach_heading)
    // console.log(approach_content)
    // console.log(user_approach)


    // Respond with the generated code
    res.json({ generatedCode });
    const response = generatedCode;
    // console.log(response)

    const code = generatedCode.response.solidity_code;
    console.log(code)
    
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'An error occurred while generating code.' });
  }
});

app.post("/create_ZIP_file", (req,res)=>{} )

app.post("/magic_deploy", (req, res) =>{})

app.post("/Integrating_docs", (req, res) => {})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
