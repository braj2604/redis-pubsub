import { redisController } from './components/redis/redis.controller.js';

export function routeHandler(router) {
  redisController(router);
}
