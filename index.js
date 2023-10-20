const Discord = require("discord.js");
const voiceDiscord = require(`@discordjs/voice`);
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent,
  ],
});
const { token, prefix, ownerid } = require("./botconfig/config.json");
const { Database } = require("beta.db");
const fs = require("fs");
const db = new Database("./db/role.json");
const radio = require(`./botconfig/radiostation.json`);

client.once(Discord.Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity("Coded By : Hesam TooVinS", {
    type: Discord.ActivityType.Listening,
  }); //You can change type to : LISTENING , COMPETING , PLAYING
});

client.on(Discord.Events.MessageCreate, async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  //help menu
  if (command === "help") {
    const helpembed = new Discord.EmbedBuilder()
      .setTitle("📻 Help menu")
      .addFields(
        { name: `${prefix}radio`, value: "play radio ", inline: true },
        {
          name: `${prefix}radiolist`,
          value: "list of popular radio station",
          inline: true,
        },
        { name: `${prefix}stats`, value: "stats of bot", inline: true },
        {
          name: `${prefix}setrole`,
          value: "Set role to Control Bot",
          inline: true,
        },
        { name: `${prefix}reset`, value: "Restart Bot", inline: true },
        { name: `${prefix}dc`, value: "Disconnect Bot", inline: true }
      )
      .setThumbnail(
        `https://play-lh.googleusercontent.com/oV1AVbkOV2M7rqOAENeuNAnBL6ftRpECFDiiKU4w19tX_rTHTnwJRrPcJ2yy270taMU`
      )
      .setFooter({
        text: `Requested By ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({
          extension: "png",
          dynamic: true,
        }),
      })
      .setColor("Green")
      .setTimestamp();
    message.reply({ embeds: [helpembed] });
  }

  // radio list you can pick radio id and play
  if (command == `radiolist`) {
    fs.readFile("./botconfig/radioid.json", "utf8", function (err, contents) {
      const radioidembed = new Discord.EmbedBuilder()
        .setTitle("Radio Id List")
        .setDescription("```json\n" + contents + "\n```")
        .setFooter({
          text: `Requested By ${message.author.username}`,
          iconURL: message.author.displayAvatarURL({
            extension: "png",
            dynamic: true,
          }),
        })
        .setColor("GREEN")
        .setTimestamp();
      message.reply({ embeds: [radioidembed] });
    });
  }

  //set role for some cmd s
  if (command == "setrole") {
    if (message.author.id !== `${ownerid}`)
      return message.reply({
        content: `:x: **You Dont Have permission to use this command!** `,
      });
    if (!args[0])
      return message.reply({
        content: `:x: **You forgot to enter a Role Id!**`,
      });
    db.set("role", args[0]);
    db.set("Guildid", message.guild.id);
    message.reply({ content: `✅**role was set**` });
  }

  //radio player
  if (command == "radio") {
    const role = db.get("role");
    if (message.author.id !== ownerid && !message.member.roles.cache.has(role))
      return message.reply({
        content: `:x: **You Dont Have permission to use this command! , you need <@&${role}> role**`,
      });
    if (!args[0])
      return message.reply({
        content:
          ":x: **You forgot to enter a Voice-Channel Id!** \n **Usage** : ``!radio [voiceid] [radioid]`` \n **e.g** : ``!radio 879417192553271367 2``",
      });
    if (args[0] % 1 != 0 || args[1] <= 0)
      return message.reply({
        content:
          ":x: **You forgot to enter a Radio Id!** \n **Usage** : ``!radio [voiceid] [1-15]`` \n **e.g** : ``!radio 879417192553271367 2``",
      });
    if (!args[1])
      return message.reply({
        content:
          ":x: **You forgot to enter a Radio Id!** \n **Usage** : ``!radio [voiceid] [radioid]`` \n **e.g** : ``!radio 879417192553271367 2``",
      });
    if (args[1] % 1 != 0 || args[1] <= 0)
      return message.reply({
        content:
          ":x: **You forgot to enter a Radio Id!** \n **Usage** : ``!radio [voiceid] [1-15]`` \n **e.g** : ``!radio 879417192553271367 2``",
      });
    if (args[1] > 15)
      return message.reply({
        content:
          ":x: **You forgot to enter a Radio Id!** \n **Usage** : ``!radio [voiceid] [1-15]`` \n **e.g** : ``!radio 879417192553271367 2``",
      });
    var connection = voiceDiscord.joinVoiceChannel({
      channelId: args[0],
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: true,
    });
    const player = voiceDiscord.createAudioPlayer();
    const resource = voiceDiscord.createAudioResource(radio[args[1]]);

    player.play(resource);
    connection.subscribe(player);
    player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
      connection.destroy();
      message.reply({ content: `:x:**Radio Station Has Been Destroyed!**` });
    });
    message.reply({ content: `📻**Radio Started**` });
  }

  //restart bot
  if (command == `reset`) {
    if (message.author.id !== `${ownerid}`)
      return message.reply({
        content: `:x: **You Dont Have permission to use this command!** `,
      });
    message.reply({ content: `**Start Restarting Bot**` });
    client.destroy();
    client.login(token);
    message.channel.send({ content: `✅ **Bot was successfully restarted**` });
  }
  // disconnect bot
  if (command == `dc`) {
    const role = db.get("role");
    if (message.author.id !== ownerid && !message.member.roles.cache.has(role))
      return message.reply({
        content: `:x: **You Dont Have permission to use this command! , you need <@&${role}> role**`,
      });
     connection.destroy();
    message.reply({ content: "✅ **Bot was successfully Disconnected** " });
  }
  // bot stats
  if (command == `stats`) {
    const statsembed = new Discord.EmbedBuilder()
      .addFields(
        {
          name: ":robot: Client",
          value: `┕\`🟢 Online!\``,
          inline: true,
        },
        {
          name: "⌛ Ping",
          value: `┕\`${Math.round(message.client.ws.ping)}ms\``,
          inline: true,
        },
        {
          name: ":file_cabinet: Memory",
          value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
          )}mb\``,
          inline: true,
        },
        {
          name: ":robot: Version",
          value: `┕\`v${require("./package.json").version}\``,
          inline: true,
        },
        {
          name: ":blue_book: Discord.js",
          value: `┕\`v${Discord.version}\``,
          inline: true,
        },
        {
          name: ":green_book: Node",
          value: `┕\`${process.version}\``,
          inline: true,
        }
      )
      .setColor("Green")
      .setFooter({
        text: `Requested By ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({
          extension: "png",
          dynamic: true,
        }),
      })
      .setTimestamp();

    message.reply({ embeds: [statsembed] });
  }
});

client.login(token);

/**********************************************************
 * @INFO
 * Bot Coded by hesam TooVinS#5284| https://discord.gg/Jhnqm5BHnt
 *********************************************************/
