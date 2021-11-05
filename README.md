# reactionfirst-bot

Discord.js bot which allows users to add several reactions to an embed and list the first few people who choose a randomly selected reaction. As seen in SoundDrout's event video published on YouTube. If you have problems, view the FAQ below.

## Deployment instructions

It's recommended to use Linux or macOS because of the better support for git and node that it has. However, if you are on Windows, **install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install)**.

---

## 0) Set up the bot

Before we even install anything, we need to create the bot application. Go to [Discord's developer page](https://discord.com/developers), sign into your Discord account, and create an application. The button will be located at the top right of the webpage next to your user icon.

Firstly, we need to invite the bot to the server. In the General Information tab on the left, copy the Client ID. This is a public ID and you can freely share it with others, since there is no adverse damage to sharing it.

Next, click on the **Bot** tab button on the left side of the screen and make a bot application. It will inherit the icon and name of the main application by default, but you can always change it later.

Use the link below to open the invite menu for your new bot. **REPLACE `BOT-ID-HERE` WITH THE CLIENT ID YOU JUST COPIED EARLIER. DO NOT REMOVE ANY TEXT BEFORE OR AFTER `BOT-ID-HERE`.**

```sh
https://discord.com/oauth2/authorize?client_id=BOT-ID-HERE&permissions=274878196800&scope=applications.commands%20bot
```

Next, we need the bot token. Go to the **Bot** tab, and underneath the bot username, copy the bot token by clicking the **Copy** button. Save the token for later, because you'll need it.

## **DO NOT EVER SHARE YOUR BOT TOKEN WITH ANYONE; THIS IS YOUR ONLY WARNING. I AM NOT RESPONSIBLE FOR ANY DAMAGE CAUSED BECAUSE OF YOU LEAKING THE TOKEN. IF YOU ACCIDENTALLY LEAK IT, REGENERATE IT IMMEDIATELY.**

With that out of the way, we've got it set up. Let's get the code environment prepared.

## 1) Install git and Node

-   Windows users should **install and use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install)** and follow the Linux instructions based on the distribution being used.

-   **macOS users can use [Homebrew](https://brew.sh)** to install both Git _and_ Node:

```sh
# MacOS Users
brew install git nodejs
```

-   **Linux users can use their favourite package manager**. On many distros, the packages are named `git` and `nodejs`. For example, if you are on Ubuntu or Debian, you can install these packages with:

```sh
# Ubuntu/Debian
sudo apt install git nodejs
```

## 2) Clone repository and install node packages

Open up your terminal if you haven't already. Run the following shell command inside the folder you want to clone the repository into:

```sh
# Clone this repository and enter the directory for it. The && is there to prevent you from entering a nonexistent directory in case the clone fails.
git clone https://gitlab.com/rhearmas/reactionfirst-bot && cd reactionfirst-bot
```

Now, install all the node modules using `yarn`:

```sh
# Install node modules. Running just "yarn" in the terminal will install all necessary packages if a "package.json" file exists, in which case it does.
yarn
```

## 3) Create the configuration file

Replace `your-token-here` and `bot-user-id` with your bot token and the bot's user ID from step 0, and push it to a file called `.env`:

```sh
# Command to run in the terminal. Feel free to type these one at a time.
cat > .env << 'EOF'
TOKEN=your-token-here
CLIENTID=bot-user-id
EOF
```

**Only replace `your-token-here` and `bot-user-id` -- don't remove any of the other text or it won't work!** If you're stuck on Windows, or you made a mistake typing the command in WSL, you will have to create the file in File Explorer and edit it manually instead:

```sh
# .env file format. Don't include this first line with the hashtag at the start of it.
TOKEN=your-token-here
CLIENTID=bot-user-id
```

## 4) Deploy the slash commands

All we have to do now is get the bot running. Since this is the first time we're running the bot, we need to deploy the slash commands:

```sh
node deploy.mjs
```

If you get a line saying `Registered application commands`, then you're all set. If not, check to make sure your configuration files are set up accordingly.

Every time you make a new slash command, you need to re-run this file to add the new slash commands.

## 5) Run the bot

The moment you've been waiting for -- getting the bot up and running. Every time you need to run the bot, enter the folder that the bot is in and run this command:

```sh
node index.mjs
```

If you get an error showing the file was not found, make sure you're in the right folder. Do your research if you need to fix it.

# FAQ

## Why should I never share my token?

The token is the main thing that lets you use your bot. If someone took the token used for your bot, they can use it to abuse the permissions that it has, especially if you make it an administrator.

## Running `index.mjs` told me the file couldn't be found!

You need to be in the folder that has all the bot code.

## `index.js` said that the file `.env` wasn't found!

You most likely didn't remove the `.txt` extension from the file. [Enable file extensions in Explorer](https://www.howtogeek.com/205086/beginner-how-to-make-windows-show-file-extensions/) and then rename the file, removing the `.txt` at the end.

## Running `deploy.mjs` didn't register the commands!

Follow step 3 and read the instructions more carefully.

## The bot said an invalid token was provided!

Re-read step 3.

## I got an invalid module error when running one of the files!

Re-read step 2.

## Why is this project considered public domain?

I want to provide aspiring Discord bot developers valuable resources for some of the most common functions in JavaScript. I don't care if you use this project for whatever you desire.

## I want to contribute to this project!

This repository won't accept merge requests unless it is a major security flaw or a highly-wanted feature that isn't ready for the master branch. Fork the project and make your own spin on it.

## I have another problem that isn't answered!

Post an issue on this repository's issue tracker. You need a GitLab account to do so.

## Will you respond to pull requests and merge request on GitHub?

No.

# Obligatory License Disclaimer

This project has no license, silly! It's published with The Unlisence, which means you can use this code however the heck you want to. No need to credit me or anything like that. If you're unsure, view LICENSE.
