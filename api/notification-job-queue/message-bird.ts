// import messagebird from 'messagebird';
// import * as messagebird from 'messagebird'
let messagebird = require('messagebird');
import config from '../config';

const initMessageBird = () => {
  return messagebird(config.messageBird.accessKey);
};

export default initMessageBird;