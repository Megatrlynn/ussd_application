const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// Language Selection Menu
app.post('/ussd', (req, res) => {
    let response = '';

    // Extract USSD input
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    // Parse user input
    const userInput = text.split('*').map(option => option.trim());

    // Determine next action based on user input
    if (userInput.length === 1) {
        // First level menu: Language selection
        response = `CON Welcome to the Voting App!\n`;
        response += `1. English\n`;
        response += `2. Swahili`;
    } else if (userInput.length === 2) {
        // Second level menu: Name input
        response = `CON Please enter your name:`;
    } else if (userInput.length === 3) {
        // Third level menu: Main menu
        if (userInput[2] === '1') {
            // Voting option selected
            response = `CON Select a candidate:\n`;
            // List candidates here
            response += `1. Candidate 1\n`;
            response += `2. Candidate 2\n`;
            response += `3. Candidate 3\n`;
            response += `4. Candidate 4\n`;
            response += `5. Candidate 5`;
        } else if (userInput[2] === '2') {
            // View votes option selected
            response = `END Votes:\n`;
            // Fetch and display voted users here
        }
    } else if (userInput.length === 4) {
        // Fourth level menu: Voting confirmation
        response = `END Thank you for voting!`;
        // Record the vote here
    }

    res.send(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
