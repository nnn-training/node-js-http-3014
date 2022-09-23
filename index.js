'use strict';
const http = require('http');
const fs = require('fs'); // GETの際にhtmlを表示するために使用
const server = http
    .createServer((req, res) => {
        const now = new Date();
        console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
        res.writeHead(200, {
            // 'Content-Type': 'text/plain; charset=utf-8'
            'Content-Type': 'text/html; charset=utf-8'
        });

        switch (req.method) {
            case 'GET':
                // res.write(`GET ${req.url}`);
                const rs = fs.createReadStream('./form.html'); // ファイル内容をストリーム形式データで取り込み
                rs.pipe(res); // html情報を res ストリームにpipe（出力<=>入力 データ受け渡す 例：ls /bin | less）
                // pipe にはres.end()が含まれるので記載しない。POSTメソッドのみに記載する。
                break;
            case 'POST':
                // res.write(`POST ${req.url}`);
                let rawData = '';
                req
                    .on('data', chunk => {
                        rawData += chunk;
                    })
                    .on('end', () => {
                        // console.info(`[${now}] Data posted: ${rawData}`);
                        // dataがPOSTされた場合の処理
                        // 届いた段階では文字化けしているので元の文字形式に戻す（decode）
                        const decoded = decodeURIComponent(rawData);
                        console.info(`[${now}] 投稿: ${decoded}`);
                        // POST遷移画面で表示するHTML
                        res.write(
                            `<!DOCTYPE html><html lang="ja"><body><h1>${decoded} が投稿されました</h1></body></html>`
                        );
                        res.end(); // POST されたらresponseの接続を終了する
                    });
                break;
            default:
                break;
        }
        // res.end();
    })
    .on('error', e => {
        console.error(`[${new Date()}] Server Error`, e);
    })
    .on('clientError', e => {
        console.error(`[${new Date()}] Client Error`, e);
    });
const port = 8000;
server.listen(port, () => {
    console.info(`[${new Date()}] Listening on ${port}`);
});