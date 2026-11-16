import * as migration_20261027_023710 from './20261027_023710';
import * as migration_20261027_041320 from './20261027_041320';
import * as migration_20261109_092936 from './20261109_092936';
import * as migration_20261110_072707 from './20261110_072707';
import * as migration_20261110_084848 from './20261110_084848';
import * as migration_20261110_085601 from './20261110_085601';
import * as migration_20261116_082110 from './20261116_082110';
import * as migration_20261116_083237 from './20261116_083237';

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
    name: '20261109_092936',
  },
  {
    up: migration_20261110_072707.up,
    down: migration_20261110_072707.down,
    name: '20261110_072707',
  },
  {
    up: migration_20261110_084848.up,
    down: migration_20261110_084848.down,
    name: '20261110_084848',
  },
  {
    up: migration_20261110_085601.up,
    down: migration_20261110_085601.down,
    name: '20261110_085601',
  },
  {
    up: migration_20261116_082110.up,
    down: migration_20261116_082110.down,
    name: '20261116_082110',
  },
  {
    up: migration_20261116_083237.up,
    down: migration_20261116_083237.down,
    name: '20261116_083237'
  },
];
