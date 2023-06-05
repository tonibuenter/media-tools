#!/usr/bin/env node

import { mediatools } from './mediatools';
import * as process from 'process';

console.log('Hello from the CLI!');

mediatools(process.argv)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
