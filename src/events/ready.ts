import Client from "../structures/Client";
import logger from "../utils/Logger";

export default function ready(client: Client) {
  logger.info("Bot is now online!");
}
