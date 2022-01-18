const { Client, Intents, MessageEmbed , version  } = require('discord.js');
const voiceDiscord = require(`@discordjs/voice`)
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_VOICE_STATES,] });
const {token , prefix,ownerid } = require('./botconfig/config.json');
const { Database } = require('beta.db');
const db = new Database("./db/role.json")
const radio = require(`./botconfig/radiostation.json`)

client.once("ready", () =>{
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setActivity('Coded By : Hesam TooVinS', { type: 'WATCHING' }); //You can change type to : LISTENING , COMPETING , PLAYING 
})

client.on("messageCreate", message =>{
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
    
    //help menu 
    if(command === "help"){
        const helpembed = new MessageEmbed()
        .setTitle("📻 Help menu")
        .addFields(
            { name: `${prefix}radio`, value: 'play radio ', inline: true  },
            { name: `${prefix}radiolist`, value: 'list of popular radio station', inline: true },
            { name: `${prefix}stats`, value: 'stats of bot', inline: true },
            { name: `${prefix}setrole`, value: 'Set role to Control Bot', inline: true },
            { name: `${prefix}reset`, value: 'Restart Bot', inline: true },
            { name: `${prefix}dc`, value: 'Disconnect Bot', inline: true },
        )
        .setThumbnail(`https://play-lh.googleusercontent.com/oV1AVbkOV2M7rqOAENeuNAnBL6ftRpECFDiiKU4w19tX_rTHTnwJRrPcJ2yy270taMU`)
        .setFooter(`Requested By ${message.author.username}` , message.author.displayAvatarURL({ format: 'png', dynamic: true }))
        .setColor('GREEN')
        .setTimestamp()
        message.reply({embeds :[helpembed]})
    }

    // radio list you can pick radio id and play
    if(command == `radiolist`){
        const fs = require("fs")
       fs.readFile('./botconfig/radioid.json', 'utf8', function(err, contents) {
            const radioidembed = new MessageEmbed()
          .setTitle("Radio Id List")
          .setDescription('```json\n' + contents + '\n```')
          .setFooter(`Requested By ${message.author.username}` , message.author.displayAvatarURL({ format: 'png', dynamic: true }))
          .setColor('GREEN')
          .setTimestamp()
          message.reply({embeds : [radioidembed]})
        })
      
    }

    //set role for some cmd s 
 if(command == "setrole"){
	  if (message.author.id !== `${ownerid}`) return message.reply(`:x: **You Dont Have permission to use this command!** `);
        if(!args[0]) return message.reply(`:x: **You forgot to enter a Role Id!**`)
        db.set("role" , args[0])
        db.set("Guildid" , message.guild.id)
        message.reply(`✅**role was set**`)
    }

    //radio player
    if(command == "radio"){
        const role = db.get('role')
        if(message.author.id !== ownerid && !message.member.roles.cache.has(role))return message.reply(`:x: **You Dont Have permission to use this command! , you need <@&${role}> role**`)
    if (!args[0]) return message.reply(":x: **You forgot to enter a Voice-Channel Id!** \n **Usage** : ``!radio [voiceid] [radioid]`` \n **e.g** : ``!radio 879417192553271367 2``")
    if (!args[1]) return message.reply(":x: **You forgot to enter a Radio Id!** \n **Usage** : ``!radio [voiceid] [radioid]`` \n **e.g** : ``!radio 879417192553271367 2``")
        const connection = voiceDiscord.joinVoiceChannel({
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
        message.reply(`:x:**Radio Station Has Been Destroyed!**`)
    });
    message.reply(`📻**Radio Started**`)
    }

    //restart bot 
   if(command == `reset`){
    if (message.author.id !== `${ownerid}`) return message.reply(`:x: **You Dont Have permission to use this command!** `);
    message.reply(`**Start Restarting Bot**`)
    client.destroy();
    client.login(token);
    message.channel.send(`✅ **Bot was successfully restarted**`)
   }
// disconnect bot 
     if(command == `dc`){
	      if(message.author.id !== ownerid && !message.member.roles.cache.has(role))return message.reply(`:x: **You Dont Have permission to use this command! , you need <@&${role}> role**`)
    connection.destroy();
    message.reply('✅ **Bot was successfully Disconnected** ')
     }
// bot stats
   if(command == `stats`){
    const statsembed = new MessageEmbed()
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
            value: `┕\`v${version}\``,
            inline: true,
          },
          {
            name: ":green_book: Node",
            value: `┕\`${process.version}\``,
            inline: true,
          },
      )
      .setColor("GREEN")
      .setFooter(`Requested By ${message.author.username}` , message.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setTimestamp()
  
      message.reply({ embeds: [statsembed]});
   }
})

client.login(token)

/**********************************************************
 * @INFO
 * Bot Coded by ◈ hesam TooVinS#5284| https://discord.gg/Jhnqm5BHnt
 *********************************************************/
