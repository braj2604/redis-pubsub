import { subscribe, unsubscribe, readAndPublish, publish } from './redis.service.js';
import { redisClient } from './redis.config.js'

const orchestrationClient = redisClient();

export function redisController(router) {
  router.get('/health-check', (req, res) => {
    console.log('service up and running');
    res.send({success: true, message: 'service up and running'})
  })

  router.post('/start-listening', (req, res) => {
    // name of orchestration channel;
    const channelPattern = process.env.CHANNEL_PATTERN
    const connection = subscribe(orchestrationClient, channelPattern);
    if(connection) {

      // read incoming message and publish to orchestration channel
      readAndPublish(orchestrationClient, req.body.channel);

      setInterval(() => {
        publish()
      }, 2000)

      return res.json({success: true, message: `subscribed to channel-1`});
    }

    res.json({success: false, message: `Error in subscribing to channel-1`});
  })

  router.delete('/stop-listening/:channel', (req, res) => {
    unsubscribe(orchestrationClient ,req.params.channel);
    return res.json({success: true, message: 'Unsubscribed to channel-1'});
  })
}