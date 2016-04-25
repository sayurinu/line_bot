var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser());

var replyService = require('./reply');


app.get('/', function(req, res){
    res.send('hello world');
});

// test
app.post('/test', function(req, res) {
    console.log(process.env.CHANNEL_ID);
    console.log(process.env.CHANNEL_SECRET);
    console.log(process.env.MID);
    console.log(process.env.PORT);
    console.log(process.env.FIXIE_URL);

    var param = req.body.param;
    res.json({
        param: param,
    });
});


// メッセージの受け取り
app.post('/callback', function(req, res) {
    var body = req.body;

    var content = body.result[0].content;
    console.log('message received:' + content.text);

    // BOTに返信させる
    replyService.reply(content);
});


app.listen(app.get('port'), function() {
    console.log('node app is running.');
});
