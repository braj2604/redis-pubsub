import { redisClient } from './redis.config.js';
import { redisModel } from '../db/mongo.model.js';
import uuid from 'uuid/v1.js';
import { promisify } from 'util';

const publishClient = redisClient();
const client = redisClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export function subscribe(client, channel) {
  if(!client) throw new Error(`Invalid Configuration`);

  return client.psubscribe(channel);
}

export function readAndPublish(client, incomingChannel) {

  // read incoming message
  client.on("pmessage", async function (pattern, channel, message) {
    
    if(channel === incomingChannel) {
      const stringifiedMessage  = JSON.stringify({ originalChannel: channel, originalMessage: message })
  
      publishToDb(stringifiedMessage);
    } else if(channel === 'orchestrator-channel') {
      console.log('in orch channel')
      const parsedMessage = await setValueInRedis(message);
      if(parsedMessage) {
        const msgObj = new redisModel({
          originalChannel: JSON.parse(message).originalChannel, 
          originalMessage: JSON.parse(message).originalMessage, 
        })
        // writing to db
        msgObj.save();
      }
    }
  })
}

async function setValueInRedis(message) {
  const parsedMessage = JSON.parse(message);

  if(!(await getAsync(parsedMessage.originalMessage))) {
    await setAsync(parsedMessage.originalMessage, uuid());
    client.expire(parsedMessage.originalMessage, 10);
    return parsedMessage;
  }
  return false;
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
