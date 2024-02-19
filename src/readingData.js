const fs = require("fs");
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

let currentQuestionIndex = 0; // Track current question
let consecutiveCorrect = 0; // Track consecutive correct answers
let correctAnswers = 0; // Track total correct answers
let wrongAnswers = 0; // Track total wrong answers
let userScores = {}; // Object to store user scores

const sendingQuestion = async (interaction) => {
  userScores = {};
  try {
    // Read data and initialize variables
    const data = fs.readFileSync("data.json", "utf8");
    const jsonData = JSON.parse(data);
    const questions = jsonData[0].questions;

    // Function to send a specific question and handle interactions
    async function sendQuestion(interaction, question) {
      console.log(userScores);
      const embed = new EmbedBuilder()
        .setTitle(`Question ${currentQuestionIndex + 1}`)
        .addFields({ name: "Type:", value: question.type })
        .addFields({ name: "Question:", value: question.question });

      if (question.type === "mcq") {
        const optionsRow = new ActionRowBuilder();

        question.options.forEach((option, i) => {
          const button = new ButtonBuilder()
            .setCustomId(`${i + 1}`) // Ensure unique IDs
            .setLabel(` ${i + 1}). ${option}`)
            .setStyle("Primary");

          optionsRow.addComponents(button);
        });

        const sentMessage = await interaction.channel.send({
          embeds: [embed],
          components: [optionsRow],
          fetchReply: true, // Fetch replied message to update later
        });

        const filter = (interaction) =>
          interaction.isButton() &&
          interaction.user.id === interaction.user.id &&
          interaction.message.id === sentMessage.id;

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 10000, // Time limit for answer
        });

        // Handle user's answer
        collector.on("collect", async (interaction) => {
          try {
            const selectedOptionIndex = parseInt(interaction.customId) - 1;
            const correctOptionIndex = question.options.findIndex(
              (option) => option === question.correct_answer
            );

            const isCorrect = selectedOptionIndex === correctOptionIndex;

            await interaction.update({
              components: [],
              embeds: [
                embed
                  .setColor(isCorrect ? "#00FF00" : "#FF0000")
                  .setDescription(
                    isCorrect
                      ? `✅ Correct answer! +${
                          isCorrect ? (consecutiveCorrect === 2 ? 3 : 2) : 0
                        } points`
                      : `❌ Wrong answer! 0 points. The correct answer was: ${question.correct_answer}`
                  ),
              ],
            });

            // Update user score
            if (isCorrect) {
              consecutiveCorrect++; // Increment consecutive correct answers
              userScores[interaction.user.username] =
                (userScores[interaction.user.username] || 0) +
                (consecutiveCorrect === 3 ? 3 : 2);
              correctAnswers++; // Increment total correct answers
            } else {
              consecutiveCorrect = 0; // Reset consecutive correct answers
              wrongAnswers++; // Increment total wrong answers
            }
          } catch (error) {
            console.error("Error handling interaction:", error);
          } finally {
            collector.stop(); // Ensure collector stops even on errors
          }
        });

        // Handle timeout by updating the embed with a message
        collector.on("end", async (collected, reason) => {
          if (reason === "time") {
            await sentMessage.edit({
              components: [],
              embeds: [
                embed
                  .setColor("#8B4513")
                  .setDescription(
                    "⌛Time's up! The correct answer was: " +
                      question.correct_answer
                  ),
              ],
            });
          }

          // Move to the next question after the timeout
          currentQuestionIndex++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (currentQuestionIndex < questions.length) {
            await sendQuestion(interaction, questions[currentQuestionIndex]);
          } else {
            // Show scoreCard at the end of the quiz
            const scoreCardEmbed = new EmbedBuilder()
              .setTitle("ScoreCard")
              .setColor("#0000FF")
              .addFields({
                name: "Total Questions:",
                value: String(questions.length),
              })
              .addFields({
                name: "Correct Answers:",
                value: String(correctAnswers),
              })
              .addFields({
                name: "Wrong Answers:",
                value: String(wrongAnswers),
              })
              .addFields({
                name: "Total Score:",
                value: String(
                  Object.values(userScores).reduce((acc, curr) => acc + curr, 0)
                ),
              });
            sortedUserScores = Object.entries(userScores).sort(
              (a, b) => b[1] - a[1]
            );
            await interaction.channel.send({ embeds: [scoreCardEmbed] });
            showLeaderboard(interaction);
          }
        });
      } else {
        // Handle other question types as needed but i have only included mcq question
        // ...
      }
    }

    // Start with the first question
    currentQuestionIndex = 0;
    consecutiveCorrect = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    console.log(userScores);
    await sendQuestion(interaction, questions[currentQuestionIndex]);
  } catch (error) {
    console.error("Error reading or parsing JSON data:", error);
  }
};

const showLeaderboard = async (interaction) => {
  try {
    const leaderboardEmbed = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setColor("#FFFF00")
      .setDescription("High scores:");

    // Sort user scores in descending order
    const sortedUserScores = Object.entries(userScores).sort(
      (a, b) => b[1] - a[1]
    );

    // Add user scores to the leaderboard
    sortedUserScores.forEach(([userName, score], index) => {
      leaderboardEmbed.addFields({
        name: `#${index + 1} ${userName}`,
        value: `**Score:** ${score}`, // Use Markdown bold for separation
      });
    });

    // Send the leaderboard embed
    await interaction.channel.send({ embeds: [leaderboardEmbed] });
  } catch (error) {
    console.error("Error showing leaderboard:", error);
  }
};

module.exports = { sendingQuestion, showLeaderboard };
