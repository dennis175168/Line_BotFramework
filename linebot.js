var restify = require('restify');
var request = require('request');
var WebSocketClient = require('websocket').client;

//var MBF_BOT_HANDLE = 'cycubot';
var MBF_BOT_HANDLE = 'dennis_bot01';
var MBF_DIRECT_LINE_ENDPOINT = 'https://directline.botframework.com';
var MBF_DIRECT_LINE_SECRET = 'LI5pYMGr4Sw.cwA.Hu0.pszFj146xsp92FIr6X8okiur-MQDsHWZTnrYPbkT_ck';//'gXEmru1KK7s.cwA.EoA.uYca6AF-oCDLWK7gqYnc3NIvBMOajR2PE9HsSjkKYDg';
//var MBF_DIRECT_LINE_SECRET ='abV1qtXuL2Q.cwA.gL8.9pxW6akoCdzrutbYyvubdJRZza6m0uLQhf0geFzfTYw';
var LINE_BOT_CHANNEL_ACCESS_TOKEN = 'RPdzOLhBi7CfTuVQ/fpHGu5KZu6SE/3JqKbHfoFx32ip+ZH9InMmFlVjxA1zw/WDM0oKb67OqlbL7yFkIsPrtP+GZJXogemj6W+28CYogogPgdpIdDeVfIHe9Iyc+EA1F7FNiHBZ7TQjSL6cL4s1vgdB04t89/1O/w1cDnyilFU=';
var LINE_BOT_API_REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';

// Setup Restify Server
const server = restify.createServer({
    name: 'skweather',
    version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({
    mapParams: false
}));

// Webhook URL
server.post("/", function(req, res, next){

    var replyToken = req.body.events[0].replyToken;
    var userId = req.body.events[0].source.userId;
    var lineMessage = req.body.events[0].message.text;


    console.log(lineMessage);
    // console.log(replyToken);
    // console.log(userId);
    // Bypass the message to bot fraemwork via Direct Line REST API
    // Ref: https://docs.botframework.com/en-us/restapi/directline3/#navtitle

    // Start a conversation
    request.post(MBF_DIRECT_LINE_ENDPOINT + '/v3/directline/conversations',
        {
            auth: {
                'bearer': MBF_DIRECT_LINE_SECRET
            },
            json: {}
        },
        function (error, response, body) {
            // retrive the conversaion info
            var conversationId = body.conversationId;
            var token = body.token;
            var streamUrl = body.streamUrl;

            var ac = body.expires_in;
            //console.log(body);

            var ws = new WebSocketClient();
            ws.on('connect', (connection) => {
                connection.on('message',(message)=>{
                    var msg = JSON.parse(message.utf8Data);
                    
                    
                    console.log('id'+msg.activities[0].from.id);
                    console.log(msg.activities[0].text);
                    // console.log('reply: '+msg.activities[0].replyToId);
                    try {
                        var count = msg.activities[0].attachments[0].content.buttons.length;
                    } catch (error) {
                        var count = 0;
                    }
                    console.log('count: '+count);
                    
                    if(count == 0){
                        var m = {
                                    "type":"text",
                                    "text": msg.activities[0].text
                                }
        
                    }else if(count == 2){
                        var m = {
                                    "type": "template",
                                    "altText": "this is a confirm template",
                                    "template": {
                                        "type": "confirm",
                                        "text": msg.activities[0].text,
                                        "actions": [
                                            {
                                            "type": "message",
                                            "label": msg.activities[0].attachments[0].content.buttons[0].title,
                                            "text": msg.activities[0].attachments[0].content.buttons[0].value
                                            },
                                            {
                                            "type": "message",
                                            "label": msg.activities[0].attachments[0].content.buttons[1].title,
                                            "text": msg.activities[0].attachments[0].content.buttons[1].value
                                            }
                                        ]
                                    }
                                }
                    }else if(count == 4){
                        var m = {
                            "type": "template",
                            "altText": "this is a confirm template",
                            "template": {
                                "type": "buttons",
                                "text": msg.activities[0].text,
                                "actions": [
                                    {
                                    "type": "message",
                                    "label": msg.activities[0].attachments[0].content.buttons[0].title,
                                    "text": msg.activities[0].attachments[0].content.buttons[0].value
                                    },
                                    {
                                    "type": "message",
                                    "label": msg.activities[0].attachments[0].content.buttons[1].title,
                                    "text": msg.activities[0].attachments[0].content.buttons[1].value
                                    },
                                    {
                                    "type": "message",
                                    "label": msg.activities[0].attachments[0].content.buttons[2].title,
                                    "text": msg.activities[0].attachments[0].content.buttons[2].value
                                    },
                                    {
                                    "type": "message",
                                    "label": msg.activities[0].attachments[0].content.buttons[3].title,
                                    "text": msg.activities[0].attachments[0].content.buttons[3].value
                                    }
                                ]
                            }
                        }
                        
                    }else if(count == 3){
                        
                    }else{
                        var m = {
                            "type":"text",
                            "text": msg.activities[0].text+'123(Smile)'
                        }
                    }
                    
                    //console.log(msg.activities[0].attachments[0].content.buttons);
                    if (msg.activities[0].from.id == MBF_BOT_HANDLE) {
                        try {

                            // if(msg.activities[0].attachments && qq == 2){
                                request.post(LINE_BOT_API_REPLY_ENDPOINT, {
                                    auth: {
                                        'bearer': LINE_BOT_CHANNEL_ACCESS_TOKEN
                                    },
                                    json: {
                                        replyToken: replyToken,
                                        messages: [
                                            m
                                        ]
                                    }
                                }, (error, response, streamResultBody) => {
                                    console.log('log: 01')
                                    console.log(error);
                                    //console.log('streamResultBody: '+error);
                                });
                        } catch (error) {
                            console.log(error)
                        }
                        
                    }
                });
            });
            ws.connect(streamUrl);
            
            try {
                request.post(MBF_DIRECT_LINE_ENDPOINT + '/v3/directline/conversations/' + conversationId + '/activities' , {
                    auth: {
                        'bearer': token
                    },
                    json: {
                        'type': 'message',
                        'id':userId,
                        'from': {
                            //'id': userId
                            'id':userId,
                            'name':userId
                        },
                        "conversation": {
                            "id": "abcd1234",
                            "name": "conversation's name"
                        },
                        "recipient": {
                            "id": "12345678",
                            "name": "bot's name"
                        },
                        'text': lineMessage,
                    }
                }, 
                (error, response, sendBody) => {});
            } catch (error) {
                console.log(error);
            }
            
        });
        res.send(200);
        return next();


        function convertms(count ,msg){
            if(count == 0){
                var m = {
                            "type":"text",
                            "text": msg.activities[0].text+'123(Smile)'
                        }

            }else if(count == 2){
                var m = {
                            "type": "template",
                            "altText": "this is a confirm template",
                            "template": {
                                "type": "confirm",
                                "text": msg.activities[0].text,
                                "actions": [
                                    {
                                    "type": "message",
                                    "label": msg.activities[0].attachments[0].content.buttons[0].title,
                                    "text": msg.activities[0].attachments[0].content.buttons[0].value
                                    },
                                    {
                                    "type": "message",
                                    "label": msg.activities[0].attachments[0].content.buttons[1].title,
                                    "text": msg.activities[0].attachments[0].content.buttons[1].value
                                    }
                                ]
                            }
                        }
            }else if(count == 4){
                
            }else if(count == 3){
                
            }else{
                var m = {
                    "type":"text",
                    "text": msg.activities[0].text+'123(Smile)'
                }
            }

            return m;
        }




            


            // send message
            // request.post(MBF_DIRECT_LINE_ENDPOINT + '/v3/directline/conversations/' + conversationId + '/activities',
            //     {
            //         auth: {
            //             'bearer': token
            //         },
            //         json: {
            //             'type': 'message',
            //             'from': {
            //                 'id': userId
            //             },
            //             'text': lineMessage
            //         }
            //     },
            //     function(error, response, sendBody){
            //         // receive reply from stream url
            //         request.get(streamUrl + '?token=' + token, 
            //             {}, 
            //             function(error, response, streamBody){
            //                 // reply to Line user
            //                 console.log(streamBody.activities[0].text);
            //                 request.post('https://api.line.me/v2/bot/message/reply',
            //                     {
            //                         auth: {
            //                             'bearer': LINE_BOT_CHANNEL_ACCESS_TOKEN
            //                         },
            //                         json: {
            //                             replyToken: replyToken,
            //                             messages: [
            //                                 {
            //                                     "type": "text",
            //                                     "text": streamBody.activities[0].text
            //                                 }
            //                             ]
            //                         }
            //                     },
            //                     function (error, response, streamResultBody) {
            //                         console.log(streamResultBody);
            //                     });
            //              });
            //     });
    //     });
    // res.send(200);
    // return next();
});

server.listen(process.env.port || process.env.PORT || 5000, function () {
   console.log('%s listening to %s', server.name, server.url); 
});