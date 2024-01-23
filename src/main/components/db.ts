import Datastore from 'nedb';
import path from 'path';
import { app } from 'electron';

const friendsDB = new Datastore({
  filename: path.join(app.getPath('userData'), 'friends.db'),
  autoload: true,
});

const personalDB = new Datastore({
  filename: path.join(app.getPath('userData'), 'personal.db'),
  autoload: true,
});

export { friendsDB, personalDB };
