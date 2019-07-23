# Counter Strike: Global Offensive LiveStat for OBS-Studio
It show your personal LIVEstats of Counter-Strike: Global Offensive while streaming. It make use of the **[official API from Valve](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration#Sample_HTTP_POST_Endpoint_Server)** and can be integrated in OBS-Studio _(or every streaming software which can **read textfiles in real-time**)_.

❗ **Read the [Wiki](https://github.com/TheAmadeus25/CounterStrike-GlobalOffensive-LiveStat-for-OBS-Studio/wiki) how to install it.**

❕ **It generates JSON-parsed text files, only, but are full and easy customizable. Text position, size, font type, font- and background-color are set in OBS-Studio itself and independent of the script. Refresh of value are instantly but OBS-Studio has a rate of around 1 sec. You can change the output text inside of the script without recompiling.**

***

# Stream Preview (GIF)

**Preview Kill counter**
![Kill_Counter_GIF](https://github.com/TheAmadeus25/CounterStrike-GlobalOffensive-LiveStat-for-OBS-Studio/blob/master/Photos/Kill%20Counter.gif?raw=true)

**Preview Equiped Value**
![Equiped_Value_GIF](https://github.com/TheAmadeus25/CounterStrike-GlobalOffensive-LiveStat-for-OBS-Studio/blob/master/Photos/Equiped%20Value.gif?raw=true)

**Preview Mode, Map and Phase**
![Mode_Map_Phase_GIF](https://github.com/TheAmadeus25/CounterStrike-GlobalOffensive-LiveStat-for-OBS-Studio/blob/master/Photos/Map%20and%20Round.gif?raw=true)

***

It's a basic script and 100% open-source. I saw some unused variable while playing a match _(e.g. bomb planted/defused/explode, Headshoot counter, and more)_ and will be added later. Also in the future, I try to convert this into a webpage. Maybe it act faster and works still without _myPHPadmin_ and _Apache_. Well, this script need **Node.js**, because of Valve's API.

If you like it, please like and share this so everybody sees. If you want use this in your own project, please make sure there is a URL to this page and mention me. Feel free for a little donate.
