/**
 * BOT API にリクエストを送信する
 */

var request = require('request');

// ヘッダー
var headers = {
    'Content-Type' : 'application/json; charset=UTF-8',
    'X-Line-ChannelID' : process.env.CHANNEL_ID,
    'X-Line-ChannelSecret' : process.env.CHANNEL_SECRET,
    'X-Line-Trusted-User-With-ACL' : process.env.MID,
};

var client = exports;


/**
 * LINE BOT APIを利用する
 * @param to_array 送信先ユーザー
 * @param content 送信内容
 * @param isMulti 複数メッセージを同時に送るかどうか
 */
client.sendMessage = function(to_array, content, isMulti) {
    // 固定の値を設定
    var eventType = '138311608800106203';
    if (isMulti) {
        eventType = '140177271400161403';
    }

    var options = {
        url: 'https://trialbot-api.line.me/v1/events',
        proxy : process.env.FIXIE_URL,
        headers: headers,
        json: true,
        body: {
            to: to_array,
            toChannel: 1383378250, //固定
            eventType: eventType, //固定
            content: content
        }
    };

    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log('error: '+ JSON.stringify(response));
        }
    });
};
