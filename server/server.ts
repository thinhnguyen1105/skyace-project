import * as express from 'express';
import * as mongoose from 'mongoose';
import { bootstrapNextjs } from '../nextjs/bootstrapNextjs';
import apiRouter from '../api/index';
import config from '../api/config';
import * as bodyParser from 'body-parser';
import * as socketIo from 'socket.io';
import * as http from 'http';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import checkFinishedSessionsJob from '../api/cronjobs/check-finished-sessions';
import checkTimeoutGroupSlotsJob from '../api/cronjobs/check-timeout-group-slot';
import checkTimeoutRecordings from '../api/cronjobs/check-timeout-recordings';
import checkTimoutPayment from '../api/cronjobs/check-timeout-payment';
import * as morgan from 'morgan';

const bootstrap = async () => {
  const port = parseInt(process.env.PORT ? process.env.PORT : '', 10) || 3000;
  const server = express();

  // Connect To MongoDB
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(
    config.database.mongoConnectionString,
    { useNewUrlParser: true }
  );

  // Middleware
  server.use(cors({
    origin: config.nextjs.corsOrigin,
    credentials: true,
  }));
  server.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
  server.use(bodyParser.json());
  server.use(cookieParser());
  server.use(morgan('short', {
    skip: (req, _res) => {
      if (req.url.indexOf('/_next') === 0 || req.url.indexOf('/static') === 0) {
        return true;
      }
      return false;
    },
  }));

  // Cron job
  checkFinishedSessionsJob.start();
  checkTimeoutGroupSlotsJob.start();
  checkTimeoutRecordings.start();
  checkTimoutPayment.start();

  // Bootstrap API
  server.use('/api', apiRouter);

  // Bootstrap Nextjs
  await bootstrapNextjs(server);

  // Start Server
  const app = http.createServer(server);
  await app.listen(port);

  // SocketIO for demo bigbluebutton server
  const sio = socketIo(app);
  sio.on('connection', function(socket: any) {
    socket.on('startClass', _id => {
      socket.broadcast.emit('classStarted', _id);
    });
  });

  // Stop Server Message
  process.on('SIGINT', () => {
    console.log(`\nShutting down the server...Goodbye.\n`);
    process.exit();
  });
};

bootstrap();
