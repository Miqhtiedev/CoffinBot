import Discord, { ClientOptions, Collection, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { toWordsOrdinal } from "number-to-words";
import logger from "../utils/Logger";
import { IArgument, ICommand, ICommandSettings } from "./Interfaces";
import mongoose from "mongoose";
import { IGuild } from "../schemas/Guild";

export default class Client extends Discord.Client {
  prefix = "!";
  commands: Map<string, ICommand> = new Map();

  constructor(options?: ClientOptions) {
    super(options);
    console.log(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`);
    
    mongoose
      .connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        logger.info("Connected to database!");
      })
      .catch((err) => {
        logger.error("Failed to connect to database!\n" + err);
      });
  }

  executeCommand(command: ICommand, message: Message, args: string[], settings: IGuild | null) {
    if (command.guildOnly && !message.guild) return;

    try {

      // Check permissions
      if(command.permissions) {
        if(!message.member?.hasPermission(command.permissions)) {
          message.channel.send(`You are missing the required permissions to run this command! \`${command.permissions.toString()}\``);
          return;
        }
      }

      // Check arguments
      if (command.args) {
        let msg = "You have to provide";

        command.args.forEach((argument: IArgument | null, index: number) => {
          if (argument && argument.validator && !argument.validator(args[index] as string)) {
            msg += ` a ${argument.name} as the ${toWordsOrdinal(index + 1)} argument,${command.args!.length - 2 === index ? " and" : ""}`;
          }
        });

        if (msg.endsWith("and")) {
          msg = msg.substring(0, msg.length - 4);
        } else if (msg.endsWith(",")) {
          msg = msg.substring(0, msg.length - 1);
        }

        msg += ".";

        if (msg !== "You have to provide.") {
          message.channel.send(msg);
          return;
        }
      }

      // Run command
      command.run(this, message, args, settings);
    } catch (e) {
      // Catch errors
      message.channel.send(`An unexpected error occured while trying to run this command!`);
      logger.error(e);
    }
  }

  registerCommands(commandsDir: string) {
    let parentName: string | undefined = undefined;
    let count = 0;
    this.commands = walk(commandsDir);
    logger.info(`Done registering ${count} commands!`);

    function walk(dir: string) {
      const commands: Collection<string, ICommand> = new Collection();
      const files = fs.readdirSync(dir);

      files.forEach((file: string) => {
        const name = file.split(".")[0] as string;
        const stats = fs.statSync(path.join(dir, file));

        if (stats.isFile()) {
          if (name === parentName) return;

          const command: ICommand = require(path.join(dir, file)).default;

          commands.set(name, command);
          count++;
        } else if (stats.isDirectory()) {
          parentName = name;

          const subcommands = walk(path.join(dir, file));

          if (name === parentName) {
            const options: ICommandSettings = require(path.join(dir, parentName, name)).default;

            const command: ICommand = {
              description: options.description,
              guildOnly: options.guildOnly,
              defaultSubcommand: options.defaultSubcommand,
              category: options.category,
              usage: options.usage,
              subcommands,
              run: (client, message, args, settings) => {
                const subcommandName = args.shift()?.toLowerCase();
                let subcommand: ICommand | undefined = undefined;

                if (subcommandName) {
                  subcommand = subcommands.get(subcommandName);
                } else if (command.defaultSubcommand) {
                  subcommand = subcommands.get(command.defaultSubcommand);
                }

                if (subcommand) {
                  client.executeCommand(subcommand, message, args, settings);
                }
              },
            };

            commands.set(name, command);
          }
        }
      });
      return commands;
    }
  }

  registerEvents(evnetsDir: string) {
    const eventFiles = fs.readdirSync(evnetsDir);

    let e = 0;
    eventFiles.forEach((file: string) => {
      e++;
      const eventName = file.split(".")[0] as string;
      const event: () => void = require(path.join(evnetsDir, file)).default;

      this.on(eventName, event.bind(null, this));
    });
    logger.info(`Done registering ${e} events!`);
  }
}
