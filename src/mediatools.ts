#!/usr/bin/env node
import commandLineArgs, { CommandLineOptions } from 'command-line-args';
import { archive } from './archive';

const optionDefinitions = [
  { name: 'src', type: String },
  { name: 'dest', type: String },
  { name: 'dryrun', type: Boolean },
  { name: 'test-options', type: Boolean },
  { name: 'archive', type: Boolean }
];

export async function mediatools(args: string[]): Promise<CommandLineOptions | number> {
  try {
    const options = commandLineArgs(optionDefinitions, { argv: args });

    if (options['test-options']) {
      return options;
    }

    if (options['archive']) {
      return archive({ src: options['src'], dest: options['dest'], dryrun: options['dryrun'] });
    }
  } catch (e) {
    console.error('Error occurred:', e);
  }
  console.warn('usage: mediatools --archive --src src-dir --dest dest-dir');
  return 1;
}
