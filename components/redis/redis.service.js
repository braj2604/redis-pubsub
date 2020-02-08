import { redisClient } from './redis.config.js'
import { redisModel } from '../db/mongo.model.js'

const publishClient = redisClient();

export function subscribe(client, channel) {
  if(!client) throw new Error(`Invalid Configuration`);

  return client.psubscribe(channel);
}

export function readAndPublish(client, incomingChannel) {

  // read incoming message
  client.on("pmessage", function (pattern, channel, message) {
    
    if(channel === incomingChannel) {
      const stringifiedMessage  = JSON.stringify({ originalChannel: channel, originalMessage: message })
  
      publishToDb(stringifiedMessage);
    } else if(channel === 'orchestrator-channel') {
      const msgObj = new redisModel({
        originalChannel: JSON.parse(message).originalChannel, 
        originalMessage: JSON.parse(message).originalMessage, 
      })
      // writing to db
      msgObj.save(msgObj);
    }

  })
}

function publishToDb(msg) {
  const publishChannel = process.env.PUBLISH_CHANNEL
  // publishing to orchestration channel
  publishClient.publish(publishChannel, msg, () => {
    console.log(`Message published on orch`, msg);
  })
}

export function publish(){
  publishClient.publish('channel-1', 'testmsg', () => {
    console.log('msg published');
  })
}

export function unsubscribe(client, channel) {
  if(!client) throw new Error(`Invalid Configuration`);

  return client.unsubscribe(channel);
}
