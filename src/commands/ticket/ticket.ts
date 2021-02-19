import {ICommandSettings} from "../../structures/Interfaces";

const settings: ICommandSettings = {
  category: "Admin",
  description: "Setup or remove the ticket system!",
  guildOnly: true,
  usage: "ticket <setup, remove>",
  defaultSubcommand: "setup",
  permissions: ["ADMINISTRATOR"]
}

export default settings;