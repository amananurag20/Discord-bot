const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const { sendingQuestion, showLeaderboard } = require("./src/readingData");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online ✅`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }
  if (message.content === "!leaderboard") {
    // Call the showLeaderboard function to display the leaderboard
    // await showLeaderboard(interaction);
  }

  // console.log(message.author.username);
  // message.reply(`Hi ${message.author.username}`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand) return;

  if (interaction.commandName == "hey") {
    interaction.reply("Yor are a hardworking person");
    return;
  }
  if (interaction.commandName == "quiz") {
    const embed = new EmbedBuilder()
      .setTitle("Quiz App Aman Anurag")
      .setDescription("this is an embed description")
      .setColor("Random")
      .addFields({
        name: "Field title",
        value: "Some random value",
        inline: true,
      });
    sendingQuestion(interaction);

    return;
  }
});

client.login(process.env.BOT_TOKEN);
