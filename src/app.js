require("dotenv").config();

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require('whatsapp-web.js');

const handleMessage = require('./handler/messageHandler');

const edgar = new Client({
  authStrategy: new LocalAuth(),
});

edgar.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

edgar.on("ready", () => {
  console.log("Client is ready!");
});

edgar.on("message", async (message) => {
  handleMessage(edgar, message);
});

// Change to false if you don't want to reject incoming calls
const rejectCalls = true;

edgar.on('call', async (call) => {
  console.log('Call received, rejecting. GOTO Line 261 to disable', call);
  if (rejectCalls) await call.reject();
  await edgar.sendMessage(call.from, `[${call.fromMe ? 'Outgoing' : 'Incoming'}] Phone call from ${call.from}, type ${call.isGroup ? 'group' : ''} ${call.isVideo ? 'video' : 'audio'} call. ${rejectCalls ? 'This call was automatically rejected by the script.' : ''}`);
});

edgar.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

edgar.initialize();
