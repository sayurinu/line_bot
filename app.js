var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser());


app.get('/', function(req, res){
    res.send('hello world');
});

// test
app.post('/test', function(req, res) {
    console.log(process.env.CHANNEL_ID);
    console.log(process.env.CHANNEL_SECRET);
    console.log(process.env.MID);
    console.log(process.env.PORT);

    var param = req.body.param;
    res.json({
        param: param,
    });
});


// メッセージの受け取り
app.post('/callback', function(req, res) {
    var body = req.body;

    var content = body.result[0].content;
    var text = content.text;
    console.log('message received:' + text);

    var sendContent;
    if (!!~text.indexOf('ブレイブ')) {
        // 画像
        sendContent = {
            contentType: 2,
            toType: 1,
            originalContentUrl: 'https://www.cyberagent.co.jp/files/topics/9665_ext_07_0.jpg',
            //previewImageUrl: '',
        };
    } else {
        // 送られて来たテキストの語尾を変えて送信
        sendContent = {
            contentType: 1,
            toType: 1,
            text: text + 'にゃんぺろ〜！',
        };
    }

    //ヘッダーを定義
    var headers = {
        'Content-Type' : 'application/json; charset=UTF-8',
        'X-Line-ChannelID' : process.env.CHANNEL_ID,
        'X-Line-ChannelSecret' : process.env.CHANNEL_SECRET,
        'X-Line-Trusted-User-With-ACL' : process.env.MID,
    };

    // 送信相手の設定（配列）
    var to_array = [];
    to_array.push(content.from);

    // 送信データ作成
    var data = {
        to: to_array,
        toChannel: 1383378250, //固定
        eventType:'138311608800106203', //固定
        content: sendContent
    };

    //オプションを定義
    var options = {
        url: 'https://trialbot-api.line.me/v1/events',
        proxy : process.env.FIXIE_URL,
        headers: headers,
        json: true,
        body: data
    };

    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log('error: '+ JSON.stringify(response));
        }
    });
});


app.listen(app.get('port'), function() {
    console.log('node app is running.');
});
