/**
 * 返事をする
 */
var client = require('./client');

var replyService = exports;


/**
 * 受け取った内容を元に返信する内容を決定して返信を行う
 * @param content
 */
replyService.reply = function(content) {
    var contentType = content.contentType;
    var contentMetadata = content.contentMetadata;
    var text = content.text;
    var sendContent;
    var isMulti = false;

    // 送られてきた内容
    if (contentType === 1) {
        // テキストの場合
        // 内容から返信する内容を決定する
        var result = makeReply_(text);
        sendContent = result.content;
        isMulti = result.isMulti;
    } else if (contentType === 8) {
        console.log(JSON.stringify(contentMetadata));

        // スタンプの場合
        // スタンプを返信
        sendContent = {
            contentType: 8,
            toType: 1,
            contentMetadata: {
                STKID: 3,
                STKPKGID: 332,
                STKVER: 100
            },
        };
    } else {
        // その他（画像・動画・音声・位置情報・コンタクト情報）の場合
        // 固定のテキストを返信
        sendContent = {
            contentType: 1,
            toType: 1,
            text: 'メッセージありがとにゃんぺろ〜♪',
        };
    }

    // 送信相手の設定（配列）
    var to_array = [];
    to_array.push(content.from);

    client.sendMessage(to_array, sendContent, isMulti);
};


/**
 * テキストを元に返信する内容を成形する
 * @param text
 * @returns {*}
 */
function makeReply_(text) {
    var isMulti = false;
    var content;
    if (!!~text.indexOf('ブレイブ')) {
        // テキストと画像を送信
        content = {
            messageNotified: 0,
            messages: [
                {
                    contentType: 1,
                    text: text + '！！画像をどうぞ〜！',
                },
                {
                    contentType: 2,
                    originalContentUrl: 'https://www.cyberagent.co.jp/files/topics/9665_ext_07_0.jpg',
                    previewImageUrl: 'https://pbs.twimg.com/media/Cg44-C9UUAA0DbR.jpg',
                }
            ],
        };
        isMulti = true;
    } else {
        // 送られて来たテキストの語尾を変えて送信
        content = {
            contentType: 1,
            toType: 1,
            text: text + 'にゃんぺろ〜！',
        };
    }

    return {
        isMulti: isMulti,
        content: content
    };
}
