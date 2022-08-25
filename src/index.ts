import mongoose, { ConnectOptions } from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './modules/logger/logger';

let server: any;

mongoose.connect(config.mongoose.url, config.mongoose.options as ConnectOptions, ()=> {
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
})

// Retry connection
const connectWithRetry = () => {
    logger.info(`MongoDB connection with retry`)
    return mongoose.connect(config.mongoose.url, config.mongoose.options as ConnectOptions)
}

// Exit application on error
mongoose.connection.on('error', (err: any) => {
    logger.info(mongoose.connection.readyState);
    logger.error(`MongoDB connection error: ${err}`);
    mongoose.connection.close();
    setTimeout(connectWithRetry, 50000)
})

mongoose.connection.on('connected', () => {
    logger.info(mongoose.connection.readyState);
    logger.info('Mongo DB is Connected!');
})

if (config.env === 'development') {
    mongoose.set('debug', true);
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
