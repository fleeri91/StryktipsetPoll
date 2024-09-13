// Libraries import
import * as dotenv from "dotenv";
import {
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
  Interaction,
} from "discord.js";

// API
import { getEvents } from "./api";

// Dotenv setup
dotenv.config();

// Discord setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Discord token
const token = process.env.DISCORD_TOKEN;

// Poll vote store map
let pollResults: {
  [pollId: string]: {
    home: number;
    draw: number;
    away: number;
    usersVoted: Set<string>;
  };
} = {};

/**
 * Creates a single poll
 *
 * @param message
 * @param pollId
 * @param title
 */
async function createPoll(message: any, pollId: string, title: string) {
  // New discord embedbuild
  const embed = new EmbedBuilder()
    .setTitle(`Poll: ${title}`)
    .setDescription("Click the buttons below to vote!")
    .setColor("#0099ff");

  // Discord vote buttons
  const vote1 = new ButtonBuilder()
    .setCustomId(`vote_1_${pollId}`)
    .setLabel("1️⃣ Home Win")
    .setStyle(ButtonStyle.Primary);

  const voteX = new ButtonBuilder()
    .setCustomId(`vote_x_${pollId}`)
    .setLabel("❌ Draw")
    .setStyle(ButtonStyle.Primary);

  const vote2 = new ButtonBuilder()
    .setCustomId(`vote_2_${pollId}`)
    .setLabel("2️⃣ Away Win")
    .setStyle(ButtonStyle.Primary);

  // Add Discord buttons to a row
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    vote1,
    voteX,
    vote2
  );

  // Send the poll message with the embed and buttons
  const pollMessage = await message.channel.send({
    embeds: [embed],
    components: [row],
  });

  // Initialize poll results and users who have voted
  pollResults[pollId] = {
    home: 0,
    draw: 0,
    away: 0,
    usersVoted: new Set<string>(),
  };

  // Create an interaction collector to handle button clicks
  const collector = pollMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
  });

  collector.on("collect", async (interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const userId = interaction.user.id;
    const customId = interaction.customId;

    if (pollResults[pollId].usersVoted.has(userId)) {
      // User has already voted
      await interaction.reply({
        content: "You have already voted in this poll!",
        ephemeral: true,
      });
      return;
    }

    // Record the vote
    if (customId === `vote_1_${pollId}`) {
      pollResults[pollId].home += 1;
      await interaction.reply({
        content: `${interaction.user.username} voted for Home Win (1️⃣)!`,
        ephemeral: true,
      });
    } else if (customId === `vote_x_${pollId}`) {
      pollResults[pollId].draw += 1;
      await interaction.reply({
        content: `${interaction.user.username} voted for Draw (❌)!`,
        ephemeral: true,
      });
    } else if (customId === `vote_2_${pollId}`) {
      pollResults[pollId].away += 1;
      await interaction.reply({
        content: `${interaction.user.username} voted for Away Win (2️⃣)!`,
        ephemeral: true,
      });
    }

    // Mark the user as voted
    pollResults[pollId].usersVoted.add(userId);
  });

  collector.on("end", () => {
    message.channel.send(`Poll "${title}" has ended!`);
  });
}

client.once("ready", async () => {
  console.log("Bot connected!");

  const data = await getEvents("stryktipset");
  console.log(data.draws[0].events);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Command to create three polls
  if (message.content === "!poll") {
    // Create three polls with different IDs and titles
    await createPoll(message, "poll1", "Match 1");
    await createPoll(message, "poll2", "Match 2");
    await createPoll(message, "poll3", "Match 3");
  }

  // Command to stop the polls and show results
  if (message.content === "!stoppoll") {
    // Calculate and display results
    let results = "Poll Results:\n";
    for (const [pollId, result] of Object.entries(pollResults)) {
      results += `\n**${pollId.toUpperCase()}**:\n`;
      results += `1️⃣ Home Win: ${result.home} votes\n`;
      results += `❌ Draw: ${result.draw} votes\n`;
      results += `2️⃣ Away Win: ${result.away} votes\n`;
    }
    await message.channel.send(results);

    // Clear the poll results after displaying
    pollResults = {};
  }
});

client.login(token);
