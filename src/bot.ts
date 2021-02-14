if (process.env.NODE_ENV !== "production") require("dotenv").config();

import Client from "./structures/Client";
import path from "path";

const bot = new Client({
  disableMentions: "all",
  partials: ["REACTION", "MESSAGE", "CHANNEL"],
});

bot.registerCommands(path.join(__dirname, "commands"));
bot.registerEvents(path.join(__dirname, "events"));

bot.login(process.env.TOKEN);