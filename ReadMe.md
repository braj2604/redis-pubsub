## Implementing redis pub/sub in Node.js
This node application is implementation of basic publish/subscribe (pub/sub) method in redis and how redis store can be used to avoid reading the duplicate message.

## Avoid reading duplicate message from redis.

When scaling the application horizontally there are huge chances of reading duplicate messages and pushing them to db if things are not taken care of. TO avoid such scenario following approach is followed:

- Redis store needs to be used to avoid duplicate message. As soon as you subscribe a message(Json Object) from redis check whether the message exists in store or not. 

- If not, then set the message in redis key value store along with TTL (time to live) and then publish it to db. 
If message exists, then simply discard the incoming message as it is duplicate message.

  (It is written in the code in redis.service.js file)

- One important thing to note here is TTL. If we do not set the TTL then there will be unnecessary accumulation of data in the store,  impacting the performance.

One other approach to avoid pushing duplicates to DB is creating unique indexing on the given collection. This approach can also be used as indexing will help in significantly improving the performance of db queries.  The assumption here is each message will contain a unique key.