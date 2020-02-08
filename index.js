import express from 'express';
import dotenv from 'dotenv';
import { routeHandler } from './router.js';
import bodyParser from 'body-parser';
import { connect } from './components/db/mongo.config.js'

dotenv.config();

const app = express();
const router = express.Router();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use('/api/v1', router)

routeHandler(router);

async function init() {
  await connect();
}

init().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
});