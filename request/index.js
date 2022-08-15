'use strict'
const line = require('@line/bot-sdk')

module.exports = async function (context, req) {
  context.log(JSON.stringify(req))
  if (req.body == null || req.body.events == null) {
    context.res = { status: 400, text: 'invalid request format' }
    return
  }
  if (req.body.events.length <= 0) {
    context.res = { status: 200, text: 'no events' }
    return
  }
  const ev = req.body.events[0]
  if (ev.type !== 'message' && ev.type !== 'join') {
    context.res = { status: 200, text: `ignore ${ev.type}` }
    return
  }
  const client = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
  })
  context.log('created line.Client()')
  await client.replyMessage(ev.replyToken, {
    type: 'text', text: JSON.stringify(ev.source)
  }).then((lineResponse) => {
    context.log('lineResponse: ' + JSON.stringify(lineResponse))
  }).catch((err) => {
    context.log.error('lineError: ' + JSON.stringify(err))
    throw err
  })
  context.res = { status: 200, text: 'done' }
  context.log(context.res)
}
