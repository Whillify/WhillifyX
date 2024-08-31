const http = require("http");
const { shell } = require("electron");
const {
  listeningPort,
  validGuilds,
  validGuildRoles,
} = require("../config/config.cjs");
const Express = require("express");
const fetch = require("node-fetch");

class AuthClient {
  constructor(oauthConfig, authResultCallback) {
    this._oauthConfig = oauthConfig;
    this._authResultCallback = authResultCallback;
    this.expressApp = Express();
    this._server = this.expressApp.listen(listeningPort);

    this.expressApp.get("/auth", this.handleAuth.bind(this));
  }

  async handleAuth(req, res) {
    if (!req.query.code) {
      this._authResultCallback(false);
      return res.redirect("https://discord.com/app");
    }

    try {
      const token = await this.getToken(req.query.code);
      const [profileData, guildArr, guildProfileData] = await Promise.all([
        this.fetchUserProfile(token),
        this.fetchUserGuilds(token),
        this.fetchGuildMember(token, validGuilds[0])
      ]);

      console.log(profileData);
      console.log(guildProfileData);

      const filteredGuildArr = guildArr.filter((guild) => validGuilds.includes(guild.id));
      console.log(filteredGuildArr);

      let resultForCallback = this.determineAuthResult(filteredGuildArr, guildProfileData.roles);
      this._authResultCallback(resultForCallback, profileData);

      console.log("Authorized!");
    } catch (err) {
      console.error("Auth error:", err);
      this._authResultCallback(false);
    }

    return res.redirect("https://discord.com/app");
  }

  async getToken(code) {
    const data = new URLSearchParams({
      ...this._oauthConfig,
      code: String(code),
    });

    const result = await fetch("https://discordapp.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    if (!result.ok) throw new Error("Token request failed");
    const json = await result.json();
    return json.access_token;
  }

  async fetchUserProfile(token) {
    const result = await fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!result.ok) throw new Error("Profile request failed");
    return result.json();
  }

  async fetchUserGuilds(token) {
    const result = await fetch("https://discordapp.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!result.ok) throw new Error("Guild request failed");
    return result.json();
  }

  async fetchGuildMember(token, guildId) {
    const result = await fetch(
      `https://discordapp.com/api/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!result.ok) throw new Error("Guild member request failed");
    return result.json();
  }

  determineAuthResult(guildArr, guildRoleArr) {
    if (!(guildArr.length > 0)) {
      return "no_guild";
    } else if (!guildRoleArr.includes(validGuildRoles[0])) {
      return "no_role";
    } else {
      return true;
    }
  }

  stopListening() {
    this._server.close();
  }

  openBrowser() {
    shell.openExternal(
      `https://discord.com/api/oauth2/authorize?client_id=${
        this._oauthConfig.client_id
      }&redirect_uri=${encodeURI(
        this._oauthConfig.redirect_uri
      )}&response_type=code&scope=${encodeURI(this._oauthConfig.scope)}`
    );
  }
}

module.exports = AuthClient;