import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();

// unhandledRejection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit();
});

// uncaughtException
process.on('uncaughtException', (err: Error) => {
  console.log(err.message);
  console.log('UncaughtException ! 💥 shutting down....');

  process.exit(1);
});
