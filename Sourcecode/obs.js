/*
  ┌──────────────────────────────────────────────────────────────────────────────────┐
  │ Counter Strike: Global Offensive LiveStats for OBS-Studio by TheAmadeus25        ┃
  ├──────────────────────────────────────────────────────────────────────────────────┤
  │ https://theamadeus25.github.io/CounterStrike-GlobalOffensive-LiveStat-for-OBS-Studio/
  ├──────────────────────────────────────────────────────────────────────────────────┤
  │ IMPORTANT! If you like it, please share and like it! If you use this in your     ┃
  │ project, please mention me and add the URL to my GitHub page, too.               ┃
  ├──────────────────────────────────────────────────────────────────────────────────┤
  │                                                                                  ┃
  │                                                                                  ┃
  │                                                                                  ┃
  │                                                                                  ┃
  │                                                                                  ┃
  │                                                                                  ┃
  ├──────────────────────────┬───────────────────────────────────────────────────────┤
  │ Version: 0.5.0 - BETA      Date: 12.Oct.2019                                     ┃
  ├──────────────────────────┴───────────────────────────────────────────────────────┤
  │ + Add Support for Websocket UDP (e.g. ESP8266 in this case)                      ┃
  │ → https://github.com/TheAmadeus25/CounterStrike-GlobalOffensive-Ambilight-System ┃
  │ + Add color for console                                                          ┃
  │ - Removing all Error return for JSON Parsing (its blocking for CSGO Ambilight)   ┃
  │ + Add error Message for TxT-Files                                                ┃
  └──────────────────────────────────────────────────────────────────────────────────┘
*/

http = require('http');																	// Communication via HTTP for CS:GO
fs = require('fs');																		// FileSharing

dgram = require('dgram');


// Read the Wiki on GitHub for more precise information about the configuration
port = 65000;																			// change PORT of your Computer with CS:GO into one of your "gamestate_integration..."-file
host = '192.168.178.23';																	// Change IP of your Computer with CS:GO into your Internal IP

espPort = 65001;
espIP   = '192.168.178.48';

// ---

var obs;																				// Variable for JSON Parsing

// Read the Wiki on GitHub for more precise information about the configuration
// map
var mode, name, phase, round;
var score_ct, consecutive_round_losses_ct, timeouts_remaining_ct, matches_won_this_series_ct;
var score_t, consecutive_round_losses_t, timeouts_remaining_t, matches_won_this_series_t;
var num_matches_to_win_series_ct, num_matches_to_win_series_t, current_spectators, souvenirs_total;

// round
var round_phase, win_team, bomb;

// player_id
var player_steamid, player_name, observer_slot, team, activity;

// player_state
var health, armor, helmet, defusekit, flashed, smoked, burning, money, round_kills, round_killshs, equip_value;

// player_match_stats
var kills, assists, deaths, mvps;

// provider
var provider_name, appid, version, steamid, timestamp;

// previously
// Not implemented, yet.

// added / round / bomb
// Not implemented, yet.

// ---

// Sourcecode based on the official API from Valve:
// https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration

server = http.createServer( function(req, res) {										// Starting our Server/Loop

    if (req.method == 'POST') {															// Communication with POST-request (similar like in PHP)
        console.log('\x1b[32m%s\x1b[0m',"Handling POST request...");					// Console output in green
        res.writeHead(200, {'Content-Type': 'text/html'});								// HTML Header with code: 200 (OK)

        var body = '';																	// (Re-)declare and clear variable body as Input buffer
        req.on('data', function (data) {												// Start receving data
            body += data;																// Add new data into buffer without overwrite
        });
        req.on('end', function () {														// Stop receving data
            console.log('\x1b[33m%s\x1b[0m',body);										// Show Input buffer on Console in yellow
        	res.end( '' );																// 
			
			// ---
			
			try {																		// Try-Catch prevent from stopping this Server/Script
				obs = JSON.parse(body);													// Parsing JSON File catched from the Game
			} catch (e) {																// Catch errorcode
				return console.log('\x1b[31m%s\x1b[0m',"FAILED Parsing JSON");			// The Game doesn't send ALL Information at once. JSON crash immediately if no/not all data are send (e.g. { } after startup) in red
				//return console.error(e);
			}
			
			
			try {																		// Try-Catch prevent from stopping this Server/Script
				mode     					= obs.map.mode;								// Parsing JSON into variable
				name     					= obs.map.name;								// Parsing JSON into variable
				phase    					= obs.map.phase;							// Parsing JSON into variable
				round    					= obs.map.round;							// Parsing JSON into variable
				num_matches_to_win_series_ct= obs.map.team_ct.num_matches_to_win_series;// Parsing JSON into variable
				current_spectators			= obs.map.current_spectators;				// Parsing JSON into variable
				souvenirs_total				= obs.map.souvenirs_total;					// Parsing JSON into variable
				score_ct 					= obs.map.team_ct.score;					// Parsing JSON into variable
				consecutive_round_losses_ct = obs.map.team_ct.consecutive_round_losses;	// Parsing JSON into variable
				timeouts_remaining_ct		= obs.map.team_ct.timeouts_remaining;		// Parsing JSON into variable
				matches_won_this_series_ct  = obs.map.team_ct.matches_won_this_series;	// Parsing JSON into variable
				score_t  				   	= obs.map.team_t.score;						// Parsing JSON into variable
				consecutive_round_losses_t 	= obs.map.team_t.consecutive_round_losses;	// Parsing JSON into variable
				timeouts_remaining_t	   	= obs.map.team_t.timeouts_remaining;		// Parsing JSON into variable
				matches_won_this_series_t  	= obs.map.team_t.matches_won_this_series;	// Parsing JSON into variable
				num_matches_to_win_series_t	= obs.map.num_matches_to_win_series;		// Parsing JSON into variable
			} catch (e) {																// Catch errorcode
				console.log('\x1b[31m%s\x1b[0m',"FAILED Parsing JSON: 'map'");	// The Game doesn't send ALL Information at once. JSON crash immediately if no data are send (e.g. { }) in red
				//return console.error(e);
				
				fs.writeFile('map.txt', "", (err) => {
				// if (err) throw err;
				console.log('\x1b[31m%s\x1b[0m',"FAILED create/write File: 'map.txt'");
			});
				
				fs.writeFile('round.txt', "", (err) => {
				// if (err) throw err;
				console.log('\x1b[31m%s\x1b[0m',"FAILED create/write File: 'round.txt'");
			});
			
			fs.writeFile('player.txt', "", (err) => {
				// if (err) throw err;
				console.log('\x1b[31m%s\x1b[0m',"FAILED create/write File: 'player.txt'");
			});
			
			fs.writeFile('player_match_stats.txt', "", (err) => {
				// if (err) throw err;
				console.log('\x1b[31m%s\x1b[0m',"FAILED create/write File: 'player_match_stats.txt'");
			});
				
			}
	
				
			try {																		// Try-Catch prevent from stopping this Server/Script
				round_phase = obs.round.phase;											// Parsing JSON into variable
				win_team	= obs.round.win_team;										// Parsing JSON into variable
				bomb		= obs.round.bomb;											// Parsing JSON into variable
			} catch (e) {																// Catch errorcode
				console.log('\x1b[31m%s\x1b[0m',"FAILED Parsing JSON: 'round'");	// The Game doesn't send ALL Information at once. JSON crash immediately if no data are send (e.g. { }) in red
				//return console.error(e);
			}
				
				
			try {																		// Try-Catch prevent from stopping this Server/Script
				player_steamid	= obs.player.steamid;									// Parsing JSON into variable
				player_name 	= obs.player.player_name;								// Parsing JSON into variable
				observer_slot 	= obs.player.observer_slot;								// Parsing JSON into variable
				team 			= obs.player.team;										// Parsing JSON into variable
				activity 		= obs.player.activity;									// Parsing JSON into variable
			} catch (e) {																// Catch errorcode
				console.log('\x1b[31m%s\x1b[0m',"FAILED Parsing JSON: 'player'");// The Game doesn't send ALL Information at once. JSON crash immediately if no data are send (e.g. { }) in red
				//return console.error(e);
			}
				
				
			try {																		// Try-Catch prevent from stopping this Server/Script
				health 			= obs.player.state.health;								// Parsing JSON into variable
				armor 			= obs.player.state.armor;								// Parsing JSON into variable
				helmet 			= obs.player.state.helmet;								// Parsing JSON into variable
				defusekit 		= obs.player.state.defusekit;							// Parsing JSON into variable
				flashed 		= obs.player.state.flashed;								// Parsing JSON into variable
				smoked 			= obs.player.state.smoked;								// Parsing JSON into variable
				burning 		= obs.player.state.burning;								// Parsing JSON into variable
				money 			= obs.player.state.money;								// Parsing JSON into variable
				round_kills 	= obs.player.state.round_kills;							// Parsing JSON into variable
				round_killshs 	= obs.player.state.round_killhs;						// Parsing JSON into variable
				equip_value 	= obs.player.state.equip_value;							// Parsing JSON into variable
			} catch (e) {																// Catch errorcode
				console.log('\x1b[31m%s\x1b[0m',"FAILED Parsing JSON: 'player.state'");				// The Game doesn't send ALL Information at once. JSON crash immediately if no data are send (e.g. { }) in red
				//return console.error(e);
			}	
				

				
			try {																		// Try-Catch prevent from stopping this Server/Script
				kills   = obs.player.match_stats.kills;									// Parsing JSON into variable
				assists = obs.player.match_stats.assists;								// Parsing JSON into variable
				deaths  = obs.player.match_stats.deaths;								// Parsing JSON into variable
				mvps    = obs.player.match_stats.mvps;									// Parsing JSON into variable
			} catch (e) {																// Catch errorcode
				console.log('\x1b[31m%s\x1b[0m',"FAILED Parsing JSON: 'player.match_stats'");		// The Game doesn't send ALL Information at once. JSON crash immediately if no data are send (e.g. { }) in red
			//	//return console.error(e);
			}
				
				
			try {																		// Try-Catch prevent from stopping this Server/Script
				provider_name 	= obs.provider.name;									// Parsing JSON into variable
				appid 			= obs.provider.appid;									// Parsing JSON into variable
				version 		= obs.provider.version;									// Parsing JSON into variable
				steamid 		= obs.provider.steamid;									// Parsing JSON into variable
				timestamp 		= obs.provider.timestamp;								// Parsing JSON into variable
			} catch (e) {																// Catch errorcode
				console.log('\x1b[31m%s\x1b[0m',"FAILED Parsing JSON: 'provider'");					// The Game doesn't send ALL Information at once. JSON crash immediately if no data are send (e.g. { }) in red
				//return console.error(e);
			}
			
			console.log("--------------------------------------------------------------");
			
				
			
			// Add Information to File's
			// You can change the Information like you want.
			// fs.writeFile('FILE.txt', "TEXT" or VAR, (err) => {...});
			fs.writeFile('map.txt', "Mode: " + mode + " | Name: " + name, (err) => {
				// if (err) throw err;
			});
			
			fs.writeFile('team.txt', "CT " + score_ct + " : " + score_t + " T", (err) => {
				// if (err) throw err;
			});
			
			fs.writeFile('round.txt', "Phase: " + round_phase + "     ", (err) => {
				// if (err) throw err;
			});
			
			fs.writeFile('player.txt', "$" + equip_value, (err) => {
				// if (err) throw err;
			});
			
			fs.writeFile('player_match_stats.txt', "K/A/D   " + kills + " | " + assists + " | " + deaths + " ✫ " + mvps, (err) => {
				// if (err) throw err;
			});
			
			fs.writeFile('added.txt', "(empty)", (err) => {
				// if (err) throw err;
			});
			
			
			if (round_killshs != 0) {
				fs.writeFile('headshot.txt', "Headshot: " + round_killshs, (err) => {
				// if (err) throw err;
				});
			} else {
				fs.writeFile('headshot.txt', "", (err) => {
				// if (err) throw err;
				});
			}

			
			if (bomb == "planted" || bomb == "exploded" || bomb == "defused") {
				fs.writeFile('bomb.txt', "Bomb: " + bomb, (err) => {
				// if (err) throw err;
				});
			} else {
				fs.writeFile('bomb.txt', "", (err) => {
				// if (err) throw err;
				});
			}
			
			
			// ---
			var message = new Buffer.from(health + ';' + armor + ';' + helmet + ';' + win_team + ';' + flashed + ';' + smoked + ';' + activity + ';');
				
			var client = dgram.createSocket('udp4');
			client.send(message, 0, message.length, espPort, espIP, function(err, bytes) {
			if (err) throw err;
			console.log('\x1b[36m%s\x1b[0m','UDP message sent to ' + espIP + ':' + espPort);
			console.log("--------------------------------------------------------------");
			client.close();
			});
				
				
			// ---
			
        });
			
    }
    else if (req.method == 'GET') {	
		//res.end('Response from 65001');
		res.end('Sorry, we wont buy anything. Please leave us alone');
        //res.end(round_killshs + ';');
		
		//console.log("Not expecting other request types...");							// 
        //res.writeHead(200, {'Content-Type': 'text/html'});
		//var html = '<html><body>HTTP Server at http://' + host + ':' + port + '</body></html>';
        //res.end(html);
    }

});

server.listen(port, host);

console.log('\x1b[36m%s\x1b[0m','Listening at: http://' + host + ':' + port);
console.log('\x1b[36m%s\x1b[0m','ESP8266   at: http://' + espIP + ':' + espPort);

// Change color: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color