var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 80, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: 'fe2aae88-153f-4039-af9c-48da691745e9',//process.env.MicrosoftAppId,
    appPassword: 'srvfMXASH05:=%plpQR706;'//process.env.MicrosoftAppPassword
    // appId: '4d31b3ef-b1aa-4ca7-93a3-8e82df03474b',
    // appPassword: 'dzrFFTLK0322%:povdJF8!+'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("You said: %s", session.message.text);
// });


var bot = new builder.UniversalBot(connector, [
    // function(session){
    //     session.send('u said');
    // }
    // function (session) {
    //     //session.send("你好,請問你有報名微軟實習的表單了嗎??");
    //     builder.Prompts.text(session, "準備好和我聊聊天獲得精美禮物了嗎?? 1.GO  2.還沒ㄟ ");
    // },
    // function (session,results){
    //     session.endDialog(`ans:${JSON.stringify(results.response)}!`);
    //     if(results.response == '1'){
    //         console.log('dennis');
    //         session.beginDialog('form_start',{
    //             matched: /^show cart$/i
    //         });
    //     }else{
    //         console.log('tennis');
    //         session.send('others');
    //     }
    // }

    function (session) {
        //session.send("你好,請問你有報名微軟實習的表單了嗎??");
        builder.Prompts.choice(session, "準備好和我聊聊天獲得精美禮物了嗎?", "Yes|No", { listStyle: builder.ListStyle.button });
        // if(results.response.index == '0'){
        //     session.beginDialog('form_start',{matched: /^show cart$/i});
        // }else{
        //     session.send('這是我報名連結~~');
        // }
    },
    function (session,results){
        session.endDialog(`ans:${JSON.stringify(results.response)}!`);
    }
]);
var data = [{
    'MOI':'市場行銷助理 MAA 的工作內容為支援產品行銷、市場調查及網路社群行銷，以及協助研討會活動接待及管理。\n 工作時間為平日兩到三天，會依照不同部門主管的需求調整。產品行銷助理 SAA 的工作內容為針對特定產品行銷的 B2C 產品通路推廣、支援大型活動及網路社群行銷，或是擔任 B2B 企業講師，至經銷商或企業講課，藉此提升口語表達與專業知識的能力。\n 工作時間為兩到三天，會依照不同部門主管的需求調整。(大型活動及駐點協銷等工作多在週末假日，企業講課的工作則在平日一到兩天。)',
    'OAI':'行政助理的工作內容為協助主管們執行日常行政庶務，依照不同部門支援行政或行銷相關工作，主要為資料輸入與彙整分析、報表文件製作、專案支援、文案撰寫、部門業務行政支援等等，工作必須會使用 Office 軟體 ( Outlook、Word、Excel、PowerPoint ) 。\n 工作時間約為兩到三天，實際工作日依照不同部門主管工作上的需求調整。',
    'TAI':'技術助理的工作內容為網頁開發、Microsoft Partner 技術支援及協助專案管理。\n與研發助理不同的是，技術助理會在行銷營運部門或是產品相關部門實習，協助解決產品技術問題。\n因此，除了具備產品知識與技術外，具備周慮的思維及跨部門溝通能力也是很重要的。依照不同部門主管工作上的需求，工作時間約為兩到三天。在工作中可以學習新技術、激盪新想法，更有機會與產品經理一同拜訪客戶與企業簡報，除了與電腦實作外，也能訓練自己的表達能力，更能拓展人脈。',
    'RDI':'研發助理的工作內容依所屬部門的不同，大致分為基本軟體程式設計、測試軟體程式、微軟產品協助開發等等。\n因此，研發助理的專業和邏輯思考分析能力相對於其他職務顯得更為重要。\n在測試程式時若發現有誤，研發助理也要協助解決相關問題。依照不同部門主管工作上的需求，工作時間約為三到四天。在工作中，研發助理須具有創新思維，才能協助微軟產品開發創造價值。'

    
}]

bot.dialog('test' , (session)=>{
    console.log('qqq');
    session.send('dennis');
}).triggerAction({ matches: /^(d)/i});

bot.dialog('link' , (session)=>{
    session.send('這是表單連結~~ 機會難得趕快來報名吧!');
}).triggerAction({ matches: /(還沒ㄟ)/i});

bot.dialog('yy' , (session)=>{
    builder.Prompts.choice(session, "那我們開始吧!!! 請問你有報名微軟實習的表單了嗎??", "Of Course~ 填好填滿|還沒ㄟ", { listStyle: builder.ListStyle.button });
}).triggerAction({ matches: /(Yes)/i});

bot.dialog('c' , (session)=>{
    builder.Prompts.choice(session, "你對哪個職缺最有興趣啊?", "MOI|OAI|TAI|RDI", { listStyle: builder.ListStyle.button });
}).triggerAction({ matches: /(Of Course~ 填好填滿)/i});

bot.dialog('rd' , (session)=>{
    session.send('原來你喜歡RDI \n (Research Development Intern) 研發助理阿~ \n  '+ data[0].RDI);
}).triggerAction({ matches: /(RDI)/i});

bot.dialog('ma' , (session)=>{
    session.send('原來你喜歡 MOI \n (Marketing Operation Intern)行銷助理阿~ \n ' + data[0].MOI);
}).triggerAction({ matches: /(MOI)/i});

bot.dialog('ta' , (session)=>{
    session.send('原來你喜歡TAI \n (Technical Assistant Intern) 技術助理阿~ \n'+ data[0].TAI);
}).triggerAction({ matches: /(TAI)/i});

bot.dialog('aa' , (session)=>{
    session.send('原來你喜歡 OAI \n (Office Administrative Intern) 行政助理阿~ \n'+ data[0].OAI);
}).triggerAction({ matches: /(OAI)/i});





// var bot = new builder.UniversalBot(connector, [
//     function (session) {
//         //session.send("你好,請問你有報名微軟實習的表單了嗎??");
//         builder.Prompts.choice(session, "你好,請問你有報名微軟實習的表單了嗎??", "有阿|還沒ㄟ", { listStyle: builder.ListStyle.button });
//     },
//     (session)=>{
//         session.endDialog(`${results.response}!`);
//     }
// ]);

// bot.dialog('form_start' , [
//     function (session) {
//         //session.send("你好,請問你有報名微軟實習的表單了嗎??");
//         builder.Prompts.choice(session, "請問你有報名微軟實習的表單了嗎??", "有阿|還沒ㄟ", { listStyle: builder.ListStyle.button });
//     },
//     (session, results)=>{
//         if(results.response.index == '0'){
//             session.send('太好了!!請問你對什麼類型的職缺有興趣阿?');
//         }else{
//             session.send('這是我報名連結~~');
//         }
//         // session.beginDialog('form_start',{
//         //     matched: /^show cart$/i
//         // });
//         // session.endDialog(`${results.response}!`);
//     },
//     (session, results) =>{

//     }
// ]).triggerAction({ matches: /(有)/i});


//notification
// send simple notification
function sendProactiveMessage(address) {
    var msg = new builder.Message().address(address);
    msg.text('Hello, this is a notification');
    msg.textLocale('en-US');
    bot.send(msg);
  }
  
  var savedAddress;
  
  // Do GET this endpoint to delivey a notification
  server.get('/api/CustomWebApi', (req, res, next) => {
      sendProactiveMessage(savedAddress);
      res.send('triggered');
      next();
    }
  );
  
  // root dialog
  bot.dialog('2', function(session, args) {
  
    savedAddress = session.message.address;
  
    var message = 'Hello! In a few seconds I\'ll send you a message proactively to demonstrate how bots can initiate messages.';
    session.send(message);
    
    message = 'You can also make me send a message by accessing: ';
    message += 'http://localhost:' + server.address().port + '/api/CustomWebApi';
    session.send(message);
  
    setTimeout(() => {
     sendProactiveMessage(savedAddress);
    }, 5000);
  }).triggerAction({ matches: /^(n)/i});






// Add dialog to return list of shirts available
bot.dialog('showShirts', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Classic White T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Classic Gray T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
            ])
    ]);
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });



// Add dialog to handle 'Buy' button click
bot.dialog('buyButtonClick', [
    function (session, args, next) {
        // Get color and optional size from users utterance
        var utterance = args.intent.matched[0];
        var color = /(white|gray)/i.exec(utterance);
        var size = /\b(Extra Large|Large|Medium|Small)\b/i.exec(utterance);
        if (color) {
            // Initialize cart item
            var item = session.dialogData.item = { 
                product: "classic " + color[0].toLowerCase() + " t-shirt",
                size: size ? size[0].toLowerCase() : null,
                price: 25.0,
                qty: 1
            };
            if (!item.size) {
                // Prompt for size
                builder.Prompts.choice(session, "What size would you like?", "Small|Medium|Large|Extra Large");
            } else {
                //Skip to next waterfall step
                next();
            }
        } else {
            // Invalid product
            session.send("I'm sorry... That product wasn't found.").endDialog();
        }   
    },
    function (session, results) {
        // Save size if prompted
        var item = session.dialogData.item;
        if (results.response) {
            item.size = results.response.entity.toLowerCase();
        }

        // Add to cart
        if (!session.userData.cart) {
            session.userData.cart = [];
        }
        session.userData.cart.push(item);

        // Send confirmation to users
        session.send("A '%(size)s %(product)s' has been added to your cart.", item).endDialog();
    }
]).triggerAction({ matches: /(buy|add)\s.*shirt/i });


bot.dialog('greetings', [
    // Step 1
    function (session) {
        builder.Prompts.choice(session, "Which color?", "red|green", { listStyle: builder.ListStyle.button });
    },
    // Step 2
    function (session, results) {
        session.endDialog(`Hello ${results.response}!`);
    }
]).triggerAction({ matches: /(888)/i });

