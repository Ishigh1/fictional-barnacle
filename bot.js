const Discord = require("discord.js");
const mysql = require('mysql');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	sql = mysql.createConnection({
		host: process.env.HOST,
		user: process.env.USER,
		password: process.env.PASS,
		database: process.env.DATABASE
	});

	sql.connect(function (err) {
		if (err) throw err;
		console.log("Connected!");
	});
});

function add_to_message(text){
	message += text;
	done++;
	if(done == member_count || message.length > 1900)
	{
		channel_var.send(message).then(sent_msg => {last_messages.push(sent_msg)});
		message = "";
	};
}

function delete_message(msg){
	msg.delete()}

function showdate(time) {
	var time_text = "";
	time_text += time.getDate();
	switch (time.getMonth()) {
		case 0:
			time_text += " Janvier ";
			break;
		case 1:
			time_text += " Février ";
			break;
		case 2:
			time_text += " Mars ";
			break;
		case 3:
			time_text += " Avril ";
			break;
		case 4:
			time_text += " Mai ";
			break;
		case 5:
			time_text += " Juin ";
			break;
		case 6:
			time_text += " Juillet ";
			break;
		case 7:
			time_text += " Août ";
			break;
		case 8:
			time_text += " Septembre ";
			break;
		case 9:
			time_text += " Octobre ";
			break;
		case 10:
			time_text += " Novembre ";
			break;
		case 11:
			time_text += " Décembre ";
			break;
	}
	time_text += time.getFullYear();
	time_text += " à "
	time_text += time.getHours() + 1;
	time_text += ":";
	if (time.getMinutes() < 10) {
		time_text += "0";
	}
	time_text += time.getMinutes();
	return time_text;
}

function last_message(member) {
	member_count ++;
	var member_number = member_count;
	var activity_message;
	sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err, result, fields) {
		if (err) {
			throw err;
		}
		var member_last_message
		if (typeof result[0] !== 'undefined') {
			member_last_message = result[0].Last_Message;
		}
		try {
			activity_message = "Dernier post de **" + member.user.username + "** : le " + showdate(member.user.lastMessage.createdAt) + ".\n";
			if (typeof member_last_message !== 'undefined') {
				sql.query("UPDATE `Activity_bot` SET `Last_Message` = " + member.user.lastMessage.createdAt.getTime() + " WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err) { if (err) throw err; });
			}
			else {
				sql.query("INSERT INTO `Activity_bot` (`Server_ID`, `Name_ID`, `Last_Message`) VALUES (" + member.guild.id + ", " + member.id + ", " + member.user.lastMessage.createdAt.getTime() + ")", function (err) {
					if (err) {
						throw err;
					}
				});
			}
		}
		catch (e) {
			if (typeof member_last_message !== 'undefined') {
				var time = new Date();
				time.setTime(member_last_message);
				activity_message = "Dernier post de **" + member.user.username + "** : le " + showdate(time) + ".\n";
			}
			else {
				activity_message = "**" + member.user.username + "** n'a pas envoyé de post depuis que le bot est en ligne.\n";
			}
		}
		add_to_message(activity_message);
	});
}

function last_message_filter(member) {
	if (awakening.content.indexOf(member.user.username) == -1)
	{
		return;
	}
	member_count ++;
	var member_number = member_count;
	var activity_message;
	sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err, result, fields) {
		if (err) {
			throw err;
		}
		var member_last_message
		if (typeof result[0] !== 'undefined') {
			member_last_message = result[0].Last_Message;
		}
		try {
			activity_message = "Dernier post de **" + member.user.username + "** : le " + showdate(member.user.lastMessage.createdAt) + ".\n";
			if (typeof member_last_message !== 'undefined') {
				sql.query("UPDATE `Activity_bot` SET `Last_Message` = " + member.user.lastMessage.createdAt.getTime() + " WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err) { if (err) throw err; });
			}
			else {
				sql.query("INSERT INTO `Activity_bot` (`Server_ID`, `Name_ID`, `Last_Message`) VALUES (" + member.guild.id + ", " + member.id + ", " + member.user.lastMessage.createdAt.getTime() + ")", function (err) {
					if (err) {
						throw err;
					}
				});
			}
		}
		catch (e) {
			if (typeof member_last_message !== 'undefined') {
				var time = new Date();
				time.setTime(member_last_message);
				activity_message = "Dernier post de **" + member.user.username + "** : le " + showdate(time) + ".\n";
			}
			else {
				activity_message = "**" + member.user.username + "** n'a pas envoyé de post depuis que le bot est en ligne.\n";
			}
		}
		add_to_message(activity_message);
	});
}

client.on('message', msg => {
	try {
		awakening = msg
		if (msg.content.indexOf("!activity") != -1) {
			channel_var = msg.channel;
			guild_var = msg.guild;
			member_count = 0;
			message = "Activité récente : \n";
			last_messages = [];
			msg.guild.members.map(last_message);
			return;
		}
		else if (msg.content.indexOf("!factivity") != -1) {
			channel_var = msg.channel;
			guild_var = msg.guild;
			member_count = 0;
			last_messages = [];
			message = "Activité récente : \n";
			msg.guild.members.map(last_message_filter);
			return;
		}
		else if (msg.content.indexOf("!delactivity") != -1) {
			last_messages.map(delete_message);
			last_messages = [];
			return;
		}
	}
	catch (e) {
		console.error(e);
		msg.channel.send("BUUUG");
	}
});

client.login(process.env.BOT_KEY);
var message;
var channel_var;
var sql;
var member_count;
var awakening;
var last_messages;
var done;
