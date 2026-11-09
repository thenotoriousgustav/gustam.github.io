import * as migration_20261027_023710 from './20261027_023710';
import * as migration_20261027_041320 from './20261027_041320';

export const migrations = [
  {
    up: migration_20261027_023710.up,
    down: migration_20261027_023710.down,
    name: '20261027_023710',
  },
  {
    up: migration_20261027_041320.up,
    down: migration_20261027_041320.down,
    name: '20261027_041320'
  },
];
