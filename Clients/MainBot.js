const { Client, MessageEmbed , version } = require('discord.js');
const voiceDiscord = require(`@discordjs/voice`);
const { Database } = require('beta.db');
const db = new Database("./db/role.json");
const radio = require(`../botconfig/radiostation.json`);
const {
    ownerid,
    prefix,
    tokenBot1,
    channelToJoinbot1,
  } = require('../botconfig/config.json');
/**
 * Main Bot menu help o set role o stats ro dare, bagie nadrn
 * @param {Client} client 
 */
module.exports = async (client) => {

  client.once("ready", () => {
    console.log(`Connected to ${client.user.id}\n- MainBot`);
    client.user.setActivity('Edited by Kawasaki', { type: 'WATCHING' }); //You can change type to : LISTENING , COMPETING , PLAYING 
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
            { name: `${prefix}radio`, value: 'play radio', inline: true  },
            { name: `${prefix}radiolist`, value: 'list of popular radio station', inline: true },
            { name: `${prefix}stats`, value: 'stats of bot', inline: true },
            { name: `${prefix}setrole`, value: 'Set role to Control Bot', inline: true },
            { name: `${prefix}reset`, value: 'Restart Bot', inline: true },
            { name: `${prefix}dc`, value: 'Disconnect Bot', inline: true },
        )
        .setThumbnail(`https://play-lh.googleusercontent.com/oV1AVbkOV2M7rqOAENeuNAnBL6ftRpECFDiiKU4w19tX_rTHTnwJRrPcJ2yy270taMU`)
        .setFooter({text: `Requested By ${message.author.username}` , iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true })})
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
          .setFooter({text: `Requested By ${message.author.username}` , iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true })})
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
        //Baraye har bot ye station dar nazar gereftm bara hamin args ndre
        const connection = voiceDiscord.joinVoiceChannel({
            channelId: channelToJoinbot1,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: true,
        });
        const player = voiceDiscord.createAudioPlayer();
        const resource = voiceDiscord.createAudioResource(radio["1"]); //LOFI
       
        player.play(resource);
       connection.subscribe(player);
       player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
        connection.destroy();
        message.reply(`:x:**Radio Station Has Been Destroyed!**`)
    });
    message.reply(`📻**Radio Started - LOFI - Bot 1**`)
    }

    //restart bot 
   if(command == `reset`){
    if (message.author.id !== `${ownerid}`) return message.reply(`:x: **You Dont Have permission to use this command!** `);
    message.reply(`**Start Restarting Bot 1**`)
    client.destroy();
    client.login(token);
    message.channel.send(`✅ **Bot 1 was successfully restarted**`)
   }
// disconnect bot 
     if(command == `dc`){
	      if(message.author.id !== ownerid && !message.member.roles.cache.has(role))return message.reply(`:x: **You Dont Have permission to use this command! , you need <@&${role}> role**`)
    connection.destroy();
    message.reply('✅ **Bot 1 was successfully Disconnected** ')
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
            value: `┕\`v${require("../package.json").version}\``,
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
      .setFooter({text: `Requested By ${message.author.username}` , iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true })})
      .setTimestamp()
  
      message.reply({ embeds: [statsembed]});
   }
})
    
   client.login(tokenBot1);

}