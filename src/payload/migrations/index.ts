import * as migration_20260820_085210_initial from './20260820_085210_initial';
import * as migration_20260821_064952_remove_versions from './20260821_064952_remove_versions';

export const migrations = [
  {
    up: migration_20260820_085210_initial.up,
    down: migration_20260820_085210_initial.down,
    name: '20260820_085210_initial',
  },
  {
    up: migration_20260821_064952_remove_versions.up,
    down: migration_20260821_064952_remove_versions.down,
    name: '20260821_064952_remove_versions'
  },
];
