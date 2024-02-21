import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema } from '@/db/schema.ts';
import migrations from '@/db/migrations.ts';

export const adapter = new LokiJSAdapter({
  schema,
  // (You might want to comment out migrations for development purposes -- see Migrations documentation)
  migrations,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: 'pulsar', // optional db name

  // --- Optional, but recommended event handlers:

  // eslint-disable-next-line
  onQuotaExceededError: (error) => {
    console.error(error);
    // Browser ran out of disk space -- offer the user to reload the app or log out
  },
  // eslint-disable-next-line
  onSetUpError: (error) => {
    console.error(error);
    // Database failed to load -- offer the user to reload the app or log out
  },
  extraIncrementalIDBOptions: {
    onDidOverwrite: () => {
      // Called when this adapter is forced to overwrite contents of IndexedDB.
      // This happens if there's another open tab of the same app that's making changes.
      // Try to synchronize the app now, and if user is offline, alert them that if they close this
      // tab, some data may be lost
    },
    onversionchange: () => {
      // database was deleted in another browser tab (user logged out), so we must make sure we delete
      // it in this tab as well - usually best to just refresh the page
      // if (checkIfUserIsLoggedIn()) {
      //   window.location.reload();
      // }
    },
  },
});
