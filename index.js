'use strict'
const http = require('node:http')
const fs = require('node:fs')
const server = http
  .createServer((req, res) => {
    const now = new Date()
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`)
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    })

    switch (req.method) {
      case 'GET':
        const rs = fs.createReadStream('./form.html')
        rs.pipe(res)
        break
      case 'POST':
        let rawData = ''
        req
          .on('data', (chunk) => {
            rawData += chunk
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData)
            const body = `${answer.get('name')}さんは${answer.get(
              'yaki-tofu'
            )}に投票しました`
            console.info(`[${now}] ${body}`)
            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`
            )
            res.end()
          })
        break
      default:
        break
    }
  })
  .on('error', (e) => {
    console.error(`[${new Date()}] Server Error`, e)
  })
  .on('clientError', (e) => {
    console.error(`[${new Date()}] Client Error`, e)
  })
const port = 8000
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`)
})
