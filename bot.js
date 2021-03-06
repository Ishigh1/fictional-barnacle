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
	if (message.length + end_message.length > 1900){
		awakening.channel.send(message).then(sent_msg => {last_messages.push(sent_msg)});
		message = "";
	}
	else if (done == member_count){
		awakening.channel.send(message + end_message).then(sent_msg => {last_messages.push(sent_msg)});
		message = "";
	}
}

function delete_message(msg){
	msg.delete()}

function showdate(time) {
	var time_text = "";
	time.setHours(time.getHours()+1);
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
	time_text += time.getHours();
	time_text += ":";
	if (time.getMinutes() < 10) {
		time_text += "0";
	}
	time_text += time.getMinutes();
	return time_text;
}

function last_message(member) {
	if (member.user.bot) {
		return;
	}
	member_count ++;
	var activity_message;
	sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err, result, fields) {
		if (err) {
			throw err;
		}
		var member_last_message
		if (typeof result[0] !== 'undefined') {
			member_last_message = result[0].Last_Message;
		}
		if (typeof member_last_message !== 'undefined') {
			var time = new Date();
			time.setTime(member_last_message);
			activity_message = "Dernier post de **" + member.user.username + "** : le " + showdate(time) + ".\n";
		}
		else {
			activity_message = "**" + member.user.username + "** n'a pas envoyé de post depuis que le bot est en ligne.\n";
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
	var activity_message;
	sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err, result, fields) {
		if (err) {
			throw err;
		}
		var member_last_message
		if (typeof result[0] !== 'undefined') {
			member_last_message = result[0].Last_Message;
		}
		if (typeof member_last_message !== 'undefined') {
			var time = new Date();
			time.setTime(member_last_message);
			activity_message = "Dernier post de **" + member.user.username + "** : le " + showdate(time) + ".\n";
		}
		else {
			activity_message = "**" + member.user.username + "** n'a pas envoyé de post depuis que le bot est en ligne.\n";
		}
		add_to_message(activity_message);
	});
}

function dispo(member, value) {
	sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err, result, fields) {
		if (err) {
			throw err;
		}
		var prev_available;
		if (typeof result[0] !== 'undefined') {
			prev_available = result[0].Available;
		}
		if (typeof prev_available !== 'undefined') {
			sql.query("UPDATE `Activity_bot` SET `Last_Message` = " + member.user.lastMessage.createdAt.getTime() + ", `Available` = " + value + " WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err) { if (err) throw err; });
		}
		else {
			sql.query("INSERT INTO `Activity_bot` (`Server_ID`, `Name_ID`, `Last_Message`, `Available`, `Master`) VALUES (" + member.guild.id + ", " + member.id + ", " + member.user.lastMessage.createdAt.getTime() + ", 0, 0)", function (err) {
				if (err) {
					throw err;
				}
			});
		}
	});
}

function is_dispo(member) {
	if (member.user.bot) {
		return;
	}
	member_count ++;
	sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err, result, fields) {
		if (err) {
			throw err;
		}
		var is_available
		if (typeof result[0] !== 'undefined') {
			is_available = result[0].Available;
		}
		if (typeof is_available !== 'undefined' && is_available !== 0) {
			if(is_available == 1) {
				if(member.user.presence.status == "online" || member.user.presence.status == "idle") {
					add_to_message("**" + member.user.username + "**\n");
				}
				else {
					add_to_message("");
				}
			}
			else {
				add_to_message("**" + member.user.username + "**\n");
			}
		}
		else {
			add_to_message("");
		}
	});
}

function ping_dispo(member) {
	if (member.user.bot) {
		return;
	}
	member_count ++;
	sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err, result, fields) {
		if (err) {
			throw err;
		}
		var is_available
		if (typeof result[0] !== 'undefined') {
			is_available = result[0].Available;
		}
		if (typeof is_available !== 'undefined' && is_available !== 0) {
			if(is_available == 1) {
				if(member.user.presence.status == "online" || member.user.presence.status == "idle") {
					add_to_message(member);
				}
				else {
					add_to_message("");
				}
			}
			else {
				add_to_message(member);
			}
		}
		else {
			add_to_message("");
		}
	});
}

function master() {
	sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + awakening.member.guild.id + " AND `Name_ID` = " + awakening.member.id, function (err, result, fields) {
		if (err) {
			throw err;
		}
		if (result[0].Master) {
			awakening.guild.members.map(master_filter);
		}
		else {
			sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + awakening.member.guild.id + " AND `Master` = 1", function (err, result, fields) {
				if (err) {
					throw err;
				}
				if (typeof result[0] == 'undefined') {
					awakening.guild.members.map(master_filter);
				}
			});
		}
	});
}

function master_filter(member) {
	if (awakening.content.indexOf(member.user.username) == -1)
	{
		return;
	}
	sql.query("UPDATE `Activity_bot` SET `Master` = 1 WHERE `Server_ID` = " + member.guild.id + " AND `Name_ID` = " + member.id, function (err) { if (err) throw err; });
}

function count_message(msg) {
	member_count++;
	if(member_list[msg.author.username] !== 'NaN') {
		member_list[msg.author.username]++;
	}
	else{
		member_list[msg.author.username] = 1;
	}
	done++;
	if(done == member_count){
		console.log(1);
	}
}

function parseDate(str) {
  var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return (m) ? new Date(m[3], m[2]-1, m[1]) : null;
}

client.on('message', msg => {
	if(msg.channel.type == "text") {try {
		sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + msg.member.guild.id + " AND `Name_ID` = " + msg.member.id, function (err, result, fields) {
			if (typeof result[0] !== 'undefined') {
				sql.query("UPDATE `Activity_bot` SET `Last_Message` = " + msg.member.user.lastMessage.createdAt.getTime() + " WHERE `Server_ID` = " + msg.member.guild.id + " AND `Name_ID` = " + msg.member.id, function (err) { if (err) throw err; });
			}
			else {
				sql.query("INSERT INTO `Activity_bot` (`Server_ID`, `Name_ID`, `Last_Message`, `Available`, `Master`) VALUES (" + msg.member.guild.id + ", " + msg.member.id + ", " + msg.member.user.lastMessage.createdAt.getTime() + ", 0, 0)", function (err) {
					if (err) {
						throw err;
					}
				});
			}
		});
		awakening = msg;
		if (msg.content.indexOf("!activity") != -1) {
			sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + msg.member.guild.id + " AND `Name_ID` = " + msg.member.id, function (err, result, fields) {
				if (err) {
					throw err;
				}
				if(result[0].Master){
					member_count = 0;
					done = 0;
					message = "Activité récente : \n";
					last_messages = [];
					end_message = "";
					msg.guild.members.map(last_message);
				}
				return;
			});
		}
		else if (msg.content.indexOf("!factivity") != -1) {
			sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + msg.member.guild.id + " AND `Name_ID` = " + msg.member.id, function (err, result, fields) {
				if (err) {
					throw err;
				}
				if(result[0].Master){
					member_count = 0;
					done = 0;
					last_messages = [];
					end_message = "";
					message = "Activité récente : \n";
					msg.guild.members.map(last_message_filter);
				}
				return;
			});
		}
		else if (msg.content.indexOf("!delactivity") != -1) {
			sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + msg.member.guild.id + " AND `Name_ID` = " + msg.member.id, function (err, result, fields) {
				if (err) {
					throw err;
				}
				if(result[0].Master){
					last_messages.map(delete_message);
					last_messages = [];
				}
				return;
			});
		}
		else if (msg.content.indexOf("!dispo") != -1) {
			dispo(msg.member, 1);
			return;
		}
		else if (msg.content.indexOf("!Sdispo") != -1) {
			dispo(msg.member, 2);
			return;
		}
		else if (msg.content.indexOf("!indispo") != -1) {
			dispo(msg.member, 0);
			return;
		}
		else if (msg.content.indexOf("!listdispo") != -1) {
			message = "Liste des gens dispo : \n";
			member_count = 0;
			done = 0;
			end_message = "";
			last_messages = [];
			msg.guild.members.map(is_dispo);
			return;
		}
		else if (msg.content.indexOf("!pingdispo") != -1) {
			message = "Hey, ";
			member_count = 0;
			done = 0;
			end_message = ", **" + msg.author.username + "** veut jouer avec vous!";
			last_messages = [];
			msg.guild.members.map(ping_dispo);
			return;
		}
		else if (msg.content.indexOf("!master") != -1) {
			master(msg);
			return;
		}
		else if (msg.content.indexOf("!flood") != -1) {
			sql.query("SELECT * FROM `Activity_bot` WHERE `Server_ID` = " + msg.member.guild.id + " AND `Name_ID` = " + msg.member.id, function (err, result, fields) {
				if (err) {
					throw err;
				}
				if(result[0].Master){
					message = "Voilà les plus gros spammeurs : \n";
					member_count = 0;
					done = 0;
					end_message = "";
					last_messages = [];
					member_list = [];
					msg.guild.channels.map(channel => 
							       {if(channel.type == "text"){
								       channel.fetchMessages()
  									.then(messages => messages.map(count_message))
  									.catch(console.error)
								}});
				}
				return;
			})
		}
		else if (msg.content.indexOf("!birthday") != -1) {
			console.log(parseDate(msg.content));
			//msg.channel.send(showdate(date));
		}
	}
	catch (e) {
		console.error(e);
		msg.channel.send("BUUUG");
	}}
});

client.login(process.env.BOT_KEY);
var message;
var end_message;
var sql;
var member_count;
var awakening;
var last_messages;
var done;
var member_list;
