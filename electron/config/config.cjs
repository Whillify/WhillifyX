// config.js

module.exports = {
  listeningPort: 5005,
  validGuilds: ["****"],
  validGuildRoles: ["****"],
  oauth: {
    client_id: "****",
    client_secret: "****",
    redirect_uri: "http://localhost:5005/auth",
    scope: 'identify guilds guilds.members.read',
    grant_type: 'authorization_code'
  }
};