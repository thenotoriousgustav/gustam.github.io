import * as migration_20261027_023710 from './20261027_023710';
import * as migration_20261027_041320 from './20261027_041320';
import * as migration_20261109_092936 from './20261109_092936';

export const migrations = [
  {
    up: migration_20261027_023710.up,
    down: migration_20261027_023710.down,
    name: '20261027_023710',
  },
  {
    up: migration_20261027_041320.up,
    down: migration_20261027_041320.down,
    name: '20261027_041320',
  },
  {
    up: migration_20261109_092936.up,
    down: migration_20261109_092936.down,
    name: '20261109_092936'
  },
];
