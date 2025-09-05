# tf-web
Team Fortress 2 HTML port.

# tf-web version 0.1.8 prototype

This recreation of Team Fortress 2 is a loyal port to HTML using the Babylon.js engine.

# NOTE: DOWNLOADS WILL NOT WORK RN! STILL WORKING ON PACKAGES!

# Builds
tf-web-stable - TF web most recent stable build. Full package. - <a href="" download>download</a><br>
[UNDER CONSTRUCTRION] tf-web-stable-bots - TF web bot multiplayer most recent stable build. - <a href="" download>download</a><br>
[UNDER CONSTRUCTRION] tf-web-stable-lan - TF web LAN multiplayer most recent stable build. - <a href="" download>download</a><br>
[UNDER CONSTRUCTRION] tf-web-stable-single - TF web singlelayer most recent stable build. - <a href="" download>download</a>

tf-web-unstable - TF web most recent unstable build. Full package. - <a href="" download>download</a><br>
[UNDER CONSTRUCTRION] tf-web-unstable-bots - TF web bot multiplayer most recent unstable build. - <a href="" download>download</a><br>
[UNDER CONSTRUCTRION] tf-web-unstable-lan - TF web LAN multiplayer most recent unstable build. - <a href="" download>download</a><br>
[UNDER CONSTRUCTRION] tf-web-unstable-single - TF web singlelayer most recent unstable build. - <a href="" download>download</a>

tf-web-early - TF web early access build. - <a href="" download>download</a>

# Annoucements
[v0.1.6+] If you haven't upgraded to the newest version, upgrade now! "kit" is now deprecated and replaced with "loadout". The AI has been further updated. The AI patch for 0.1.7 should be released in the coming weeks to play a basic game against an AI.<br>
[v0.1.7+] The AI update has been postponed past 0.1.7. An annoucment will be made in the future resolving when it will be released.

# Packages
[in development] RTD - The classic RTD plugin. - <a href="" download>download</a><br>
[in development] Class Wars - The classic Class Wars plugin. - <a href="" download>download</a><br>
[in development] 1000 Mercs - The customizable 1000 Uncles experience. - <a href="" download>download</a><br>
[in development] Among Us - A custom Among Us inspired experience. - <a href="" download>download</a><br>
[in development] Go Karts - A custom Mario Kart inspired experience. - <a href="" download>download</a><br>
[in development] Half-Fortress - Various Half-Life levels - now played as Team Fortress 2 mercs. - <a href="" download>download</a><br>
[in development] Scream Fortress - A permanent version of Scream Fortress. - <a href="" download>download</a><br>
[in development] Randomizer - The classic Randomizer plugin. - <a href="" download>download</a><br>
[in development] Saxton Hale - The classic Versus Saxton Hale plugin. - <a href="" download>download</a><br>
[in development] Survival - A custom Mann vs Machine inspired infinite wave survival experience. - <a href="" download>download</a><br>
[in development] Left 4 Fortress - Various Left 4 Dead levels - now played as Team Fortress 2 mercs. - <a href="" download>download</a><br>

# Planned Features
- LAN based trading or online trading system
- Community made content support (without the team having to hard code it)
- Being able to make accounts
- Dedicated website (community hub, account hub, usw)


## Planned Features (Descriptions)
### Trading
The LAN based trading or online trading system will be featured in the launch update.
Trading will be included under TF.Trading (TF.Trading.LAN and TF.Trading.Online respectively).
See dedicated documentation when the update is released for full information.
In terms of the trading sequence, here's what to expect:
- Two accounts
- A menu to put items you wish to trade
- Live updates (see what everyone is offering)
- Confirm trade button to commit the trade

### Community Content
Community made content can be voted to be put in every month in the vote-a-thon!
Community made content includes everything (maps, taunts, hats, weapons, usw).
As long as the votes to put it in is more than 75%, it will be put in.
Rebalances and things of the such may be required for some community content and you can optionally filter games to show games with community content or games with strictly base game content.
If the majority of the community votes for a change, removal or things of the such for a community content item, action will be taken with the respective vote result.
Community content will have a dedicated software for development with access to the core TF web API.
Created community content will be bundeled for easy implementation or decompiling so if the team does have to hard code it, its easier.
We hope to automate the process, but it is not easy.
We apologize for the wait, but we have a lot to work on, so we hope you can understand.

### Accounts
Accounts will have a connected:
- E-Mail
- Phone number (optional)

Accounts will have the following data associated with them:
- Username
- Display name
- Password
- Profile icon
- Level
- Unlocked content (weapons, hats, usw)
- Skill level
- Overall kill-death ratio (KDR)
- Accuracy

What do each of the connected fields in your account represent?
- Username: your stored, unique name
- Display name: the name to show in matches
- Password: your account password
- Icon: the icon to show in matches in the game info menu
- Level: your game level
- Unlocked content: the content you have unlocked
- Skill level: based on various factors for each class (used for team balancing)
- Overall KDR: represents the total number of kills to deaths in all your games
- Accuracy: represents the total number of shots hit to the number of shots taken in all of your games

What factors determine my skill level for each class?
Scout
- Overall KDR
- Accuracy
Soldier
- Overall KDR
- Accuracy

### Website
The planned sections include:
- Home
- Account page
- Play online
- Play with bots
- Merch store
- Community hub
- Donations page
- Privacy, EULA, usw
<br>And more (team is discussing this still 😓)
