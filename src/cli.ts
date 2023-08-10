#!/usr/bin/env node

import { mediatools } from './mediatools';
import * as process from 'process';

(async function foo() {
  await mediatools()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .then(() => {
      process.exit(0);
    });
})();
