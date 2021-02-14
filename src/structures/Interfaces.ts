import { Message, PermissionResolvable } from "discord.js";
import { IGuild } from "../schemas/Guild";
import Client from "./Client";

export type RunCallback = (client: Client, message: Message, args: string[], settings: IGuild | null) => void;
export type ArgumentValidatorCallback = (argument: string | undefined) => boolean;

export interface ICommand extends ICommandSettings {
  run: RunCallback;
  subcommands?: Map<string, ICommand>;
}

export interface IArgument {
  name: string;
  validator?: ArgumentValidatorCallback;
}

export interface ICommandSettings {
  description: string;
  guildOnly: boolean;
  category: string;
  usage: string;
  defaultSubcommand?: string;
  args?: (IArgument | null)[];
  permissions?: PermissionResolvable;
}
