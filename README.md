# reactionfirst-bot

Discord.js bot which allows users to add several reactions to an embed and list the first few people who choose a randomly selected reaction. As seen in SoundDrout's event video published on YouTube. If you have problems, view the FAQ below.

## I've moved all the deployment instructions to the [wiki](https://github.com/boxsux/reactionfirst-bot/wiki). There's guides there for both local deployment and Railway setup.

## Deployment instructions

It's recommended to use Linux or macOS because of the better support for git and node that it has. However, if you are on Windows, **install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install)**.

## **MAKE SURE YOU HAVE READ ALL THE STEPS LISTED HERE WHILE SETTING UP THE BOT. ONE MISSED STEP WILL RETURN ERRORS.**

### 0) Set up the bot

Before we even install anything, we need to create the bot application. Go to [Discord's developer page](https://discord.com/developers), sign into your Discord account, and create an application. The button will be located at the top right of the webpage next to your user icon:
![Location of the New Application button.](https://i.vgy.me/wcyUwm.png)

With our new bot application set up, we need to invite the bot to the server. In the General Information tab on the left, copy the Client ID:
![Presentation of the application ID.](https://i.vgy.me/o3LFd3.png)
This is a public ID and you can freely share it with others, since there is no adverse damage to sharing it.

Next, click on the **Bot** tab button on the left side of the screen and make a bot application. It will inherit the icon and name of the main application by default, but you can always change it later. We'll get our token after we invite the bot to our server.

Use the link below to open the invite menu for your new bot. **REPLACE `BOT-ID-HERE` WITH THE CLIENT ID YOU JUST COPIED EARLIER. DO NOT REMOVE ANY TEXT BEFORE OR AFTER `BOT-ID-HERE`.**

```sh
https://discord.com/oauth2/authorize?client_id=BOT-ID-HERE&permissions=274878196800&scope=applications.commands%20bot
```

Next, we need the bot token. Go to the **Bot** tab, and underneath the bot username, reset your bot's token and copy it by clicking the **Copy** button. Save the token for later, because you'll need it.

![Steps showing how to get your bot token.](https://i.vgy.me/9DxQyg.png)

## **DO NOT EVER SHARE YOUR BOT TOKEN WITH ANYONE; THIS IS YOUR ONLY WARNING. I AM NOT RESPONSIBLE FOR ANY DAMAGE CAUSED BECAUSE OF YOU LEAKING THE TOKEN. IF YOU ACCIDENTALLY LEAK IT, REGENERATE IT IMMEDIATELY.**

### 1) Install git and Node

#### Windows

If you are on Windows, you have two options. **You don't have to do both of these. Only choose one.**

-   Your first option is to **install and use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install)** and follow the Linux instructions based on the distribution you installed.
-   Your second option, if you don't want to go through that hassle, is to visit [git-scm.com](http://git-scm.com/download/win) to download Git, and [nodejs.org](https://nodejs.org/en/download/current) to download <u>**the latest version**</u> of Node.

#### MacOS

-   **Use [Homebrew](https://brew.sh)** to install both Git and Node:

```sh
# MacOS Users
brew install git nodejs
```

#### Linux

-   **Use your favorite package manager**. On many distros, the packages are named `git` and `nodejs`. For example, if you are on Ubuntu or Debian, you can install these packages with `apt`:

```sh
# Ubuntu/Debian
sudo apt install git nodejs
```

### 2) Clone repository and install node packages

In your terminal, run the following inside the folder you want to clone the repository into:

```sh
# Clone this repository and enter the directory for it. The && is there to prevent you from entering a nonexistent directory in case the clone fails.
git clone https://github.com/boxsux/reactionfirst-bot && cd reactionfirst-bot
```

Your terminal's name on Windows will either be one of two things:

-   The name of the WSL distribution you installed (such as Ubuntu)
-   Git Bash if you installed Git from `git-scm.com`

Now, install all of the node packages in this project. Run `npm i` to install them.

### 3) Create the configuration file

Replace `your-token-here` and `bot-user-id` with your bot token and the bot's user ID from step 0, and push it to a file called `.env`. **THIS SHELL SCRIPT WILL NOT WORK ON WINDOWS IF YOU ARE NOT USING WSL.**

```sh
# Command to run in the terminal. Feel free to type these one at a time.
cat > .env << 'EOF'
TOKEN=your-token-here
CLIENTID=bot-user-id
EOF
```

If you're stuck on Windows, you will have to create the file in File Explorer and edit it manually. The code block below is the format of the `.env` file.

```sh
# .env file format. Don't include this first line with the hashtag at the start of it.
TOKEN=your-token-here
CLIENTID=bot-user-id
```

### 4) Deploy the slash commands

All we have to do now is get the bot running. Since this is the first time we're running the bot, we need to deploy the slash commands:

```sh
node deploy.js
```

If you get a line saying `Registered application commands`, then you're all set. If not, check to make sure your configuration files are set up properly.

Every time you make a new slash command, you need to re-run this file to add it.

### 5) Run the bot

The moment you've been waiting for - getting the bot up and running. Every time you need to run the bot, enter the folder that the bot is in and run this command:

```sh
node index.js
```

If you get an error showing the file was not found, make sure you're in the right folder. Do your research if you need to fix it.

## FAQ

### Why should I never share my token?

If someone got their hands on your bot token, they can use it to abuse the permissions that it has, especially if you make it an administrator.

### Running `index.js` told me the file couldn't be found

You need to be in the folder that has all the bot code.

### `index.js` said that the file `.env` wasn't found

You most likely didn't remove the `.txt` extension from the file. [Enable file extensions in Explorer](https://www.howtogeek.com/205086/beginner-how-to-make-windows-show-file-extensions/) and then rename the file, removing the `.txt` at the end.

### Running `deploy.js` didn't register the commands

Follow step 3 and read the instructions more carefully.

### The bot said an invalid token was provided

Re-read step 3.

### I got an invalid module error when running one of the files

Re-read step 2.

### Why is this project considered public domain?

I don't care if you use this project for whatever you desire. Imagine providing open-source if I had a problem with others using it.

### I want to contribute to this project

Fork the project and make your own spin on it. I could care less. 10 bucks says I probably won't accept merge requests for minor additions.

### Will you respond to pull/merge requests?

Unless it is a major security vulnerability, no.

### Running one of the commands in the steps above gave me a "command not found" error

Install them. You can click on the blue text if it asks for anything to be installed.

### Visual Studio Code gives me errors in the .env file

Install the [DotENV syntax support](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) extension.

## I have another problem that isn't answered

Post an issue on this repository's issue tracker. You need a GitHub account to do so.

## Obligatory License Disclaimer

This project is published with the Unlicense, which means you can use this code however the heck you want to. No need to credit me or anything like that. If you're unsure, view the LICENSE file.
