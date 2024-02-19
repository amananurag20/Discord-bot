const { REST, Routes } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "/quiz",
    description: "Start the quiz!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

const registerCommands=async () => {
  try {
    console.log("registering commands...");
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        {
          body: commands,
        }
      );
      
      console.log("Succesfully registerd commands");
  } catch (error) {
    console.log(`There was an error${error}`);
  }
};

registerCommands();