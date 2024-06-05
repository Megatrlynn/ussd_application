const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// In-memory storage for votes (for simplicity)
let votes = {
    "Raymond I. ": 0,
    "Florence U. ": 0,
    "Jean Paul K. ": 0,
    "Gaella U. ": 0,
    "Danny H. ": 0
};

// In-memory storage for user data (for simplicity)
let userNames = {};
let voters = new Set(); // Set to track phone numbers that have already voted

app.post('/ussd', (req, res) => {
    let response = '';

    // Extract USSD input
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    // Parse user input
    const userInput = text.split('*').map(option => option.trim());

    // Determine next action based on user input
    if (userInput.length === 1 && userInput[0] === '') {
        // First level menu: Language selection
        response = `CON Welcome to Mayor voting booth\n`;
        response += `1. English\n`;
        response += `2. Swahili`;
    } else if (userInput.length === 1 && userInput[0] !== '') {
        // Save user's language choice and move to the name input menu
        response = `CON Please enter your name:`;
    } else if (userInput.length === 2) {
        // Save user's name
        userNames[phoneNumber] = userInput[1];

        // Check if the phone number has already voted
        if (voters.has(phoneNumber)) {
            response = `END You have already voted. Thank you!`;
        } else {
            // Third level menu: Main menu
            response = `CON Hi ${userNames[phoneNumber]}, choose an option:\n`;
            response += `1. Vote Candidate\n`;
            response += `2. View Votes`;
        }
    } else if (userInput.length === 3) {
        if (userInput[2] === '1') {
            // Voting option selected
            response = `CON Select a candidate:\n`;
            response += `1. Raymond IGABINEZA\n`;
            response += `2. Florence UMUTONIWASE\n`;
            response += `3. Jean Paul KWIBUKA\n`;
            response += `4. Gaella UWAYO\n`;
            response += `5. Danny HABIMANA`;
        } else if (userInput[2] === '2') {
            // View votes option selected
            response = `END Votes:\n`;
            for (let candidate in votes) {
                response += `${candidate}: ${votes[candidate]} votes\n`;
            }
        }
    } else if (userInput.length === 4) {
        // Fourth level menu: Voting confirmation
        let candidateIndex = parseInt(userInput[3]) - 1;
        let candidateNames = Object.keys(votes);
        if (candidateIndex >= 0 && candidateIndex < candidateNames.length) {
            votes[candidateNames[candidateIndex]] += 1;
            voters.add(phoneNumber); // Mark this phone number as having voted
            response = `END Thank you for voting for ${candidateNames[candidateIndex]}!`;
        } else {
            response = `END Invalid selection. Please try again.`;
        }
    }

    res.send(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
