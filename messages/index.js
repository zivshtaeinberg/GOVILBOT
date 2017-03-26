/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        builder.send("ברוך הבא ל - GOVIL");       
        builder.Prompts.text(session, "מה תעודת הזהות שלך?");
    },
    function (session, results) {
        session.userData.id = results.response;
        session.send("שלום זיו שטיינברג"); 
        builder.Prompts.choice(session, "מה תרצה לעשות?",["תשלום קנסות תעבורה","ספח חדש לתעודת זהות","תעודת לידה לנולדים בישראל","הזמנת נסח טאבו מקוון","חידוש רישיון נהיגה"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("אין בעיה,"+session.userData.id +" מתחלים בתהליך" + results.response.entity);
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
