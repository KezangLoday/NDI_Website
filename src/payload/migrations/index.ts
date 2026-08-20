import * as migration_20260820_085210_initial from './20260820_085210_initial';

export const migrations = [
  {
    up: migration_20260820_085210_initial.up,
    down: migration_20260820_085210_initial.down,
    name: '20260820_085210_initial'
  },
];
