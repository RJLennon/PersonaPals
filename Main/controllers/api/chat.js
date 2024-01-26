const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Load your OpenAI API key from environment variables
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Sets up the rate limiter
let requestCount = 0;
const MAX_REQUESTS_PER_HOUR = 50; 
const resetInterval = 60 * 60 * 1000; 

// Reset the request count every hour
setInterval(() => {
  requestCount = 0;
}, resetInterval);

// POST route to handle chat requests
router.post('/', async (req, res) => {
  if (requestCount >= MAX_REQUESTS_PER_HOUR) {
    return res.status(429).send('Rate limit exceeded. Try again later.');
  }

  // Proceed with the API call
  requestCount++;

  const { userInput, chatHistory, personality } = req.body;

  let messageList = chatHistory.map(msg => ({
    role: msg.role, 
    content: msg.content
  }));

  if (personality) {
    messageList.unshift({ role: "system", content: `Respond to me as if you are ${personality}.` });
  }

  messageList.push({ role: "user", content: userInput });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messageList
    });

    const aiResponse = response.choices[0].message.content;
    res.json({ aiResponse, chatHistory: [...chatHistory, { role: "user", content: userInput, aiResponse }] });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).send(error.message);
  }
});

// Export the router so it can be used in your main server file
module.exports = router;
