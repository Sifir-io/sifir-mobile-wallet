import {appSchema} from '@nozbe/watermelondb';
import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

// TODO adapter as param to inject
const db = ({tableSchemas, modelClasses}) => {
  const schema = appSchema({
    version: 6,
    tables: tableSchemas,
  });
  // First, create the adapter to the underlying database:
  const adapter = new SQLiteAdapter({
    schema,
  });

  // Then, make a Watermelon database from it!
  const database = new Database({
    adapter,
    modelClasses,
    actionsEnabled: true,
  });
  return database;
};

export {db};
