const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function showdate(time)
{
	var time_text = "";
	time_text += time.getDate();
	switch (time.getMonth())
	{
		case 0 : 
			time_text += " Janvier ";
			break;
		case 1 : 
			time_text += " Février ";
			break;
		case 2 : 
			time_text += " Mars ";
			break;
		case 3 : 
			time_text += " Avril ";
			break;
		case 4 : 
			time_text += " Mai ";
			break;
		case 5 : 
			time_text += " Juin ";
			break;
		case 6 : 
			time_text += " Juillet ";
			break;
		case 7 : 
			time_text += " Août ";
			break;
		case 8 : 
			time_text += " Septembre ";
			break;
		case 9 : 
			time_text += " Octobre ";
			break;
		case 10 : 
			time_text += " Novembre ";
			break;
		case 11 : 
			time_text += " Décembre ";
			break;
	}
	time_text += time.getFullYear();
	time_text += " à "
	time_text += time.getHours();
	time_text += ":";
	if(time.getMinutes()<10)
	{
		time_text += "0";
	}
	time_text += time.getMinutes();
	return time_text;
}

function last_message(member)
{
	try
	{
		activity_message += "Dernier post de " + member.user.username + " : le " + showdate(member.user.lastMessage.createdAt) + ".\n";
	}
	catch(e)
	{
		activity_message += member.user.username + " n'a pas envoyé de post depuis que le bot est en ligne.\n";
	}
}

client.on('message', msg => {
	try
	{
		if(msg.content.indexOf("!activity") != -1)
		{
			channel_var = msg.channel;
			guild_var = msg.guild;
			activity_message = "";
			msg.guild.members.map(last_message);
			channel_var.send(activity_message);
		}
	}
	catch(e)
	{
		console.error(e);
		msg.channel.send("BUUUG");
	}
});

client.login(process.env.BOT_KEY);
var channel_var;
var activity_message;