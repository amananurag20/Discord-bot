## Discord Bot using Discord.js

This Discord bot is built using Discord.js and includes the following features:

1. **Multiple Choice Questions (MCQ)**:
   - Users can participate in quizzes consisting of MCQs.
   - For each correct answer, the user earns 2 points, and for each wrong answer, 0 points are awarded.
   
2. **Streak Bonus**:
   - Users receive a bonus point for answering three consecutive questions correctly.
   
3. **Time Constraint**:
   - If a user does not choose an answer within 10 seconds, the bot displays a "Time's up!" message and moves to the next question.
   
4. **Scorecard**:
   - At the end of the quiz, the bot displays a scorecard showing the total number of questions, questions attempted, and the total score achieved by the user.
   
5. **Automatic Leaderboard**:
   - After displaying the scorecard, the bot automatically shows a leaderboard featuring the highest scorers. No additional command is required to trigger this feature.
   
6. **MCQ Problem Code**:
   - The bot's code specifically handles multiple choice questions, ensuring smooth interaction with users during quizzes.

This Discord bot provides an engaging quiz experience for users, complete with scoring, streak bonuses, and automatic leaderboard updates.

## Running the Discord Bot

To run this Discord bot, follow these steps:

1. **Download the Code**:
   - Download or clone the code from the repository to your local machine.

2. **Install Dependencies**:
   - Open a terminal or command prompt in the project directory.
   - Run the command `npm install` to install the required dependencies.

3. **Register Commands**:
   - Run the command `node src/register-commands.js` in the terminal.
   - This command registers the `/quiz` interaction, allowing users to start the quiz.

4. **Run the Bot**:
   - After registering the commands, run the bot using the command `nodemon index.js`.
   - This command starts the bot and makes it operational on your Discord server.

5. **Accessing the Quiz**:
   - In your Discord server, type `/quiz` in any text channel to start the quiz.
   - The bot will respond with the first question, and users can participate by selecting options.

6. **Adding Bot Token, Server ID, and Guild ID**:
   - Before running the bot, ensure you have obtained a bot token from the Discord Developer Portal.
   - Replace the placeholder values for the bot token, server ID, and guild ID in the code with your own.
   - This ensures that the bot connects to the correct Discord server and guild.

By following these steps, you can successfully run the Discord bot and enjoy the quiz functionality in your Discord server.

