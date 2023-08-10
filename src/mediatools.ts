#!/usr/bin/env node
import commandLineArgs from 'command-line-args';
import { archive } from './archive';
import { info } from './info';
import commandLineUsage from 'command-line-usage';

const mainDefinitions = [
  { name: 'command', defaultOption: true },
  { name: 'dryrun', type: Boolean, defaultOption: false },
  // { name: 'archive', type: Boolean },
  // { name: 'test', type: Boolean },
  { name: 'src', type: String },
  { name: 'dest', type: String }
];

type ArchiveCommandOptionType = {
  src: string;
  dest: string;
  dryrun: boolean;
};

export async function mediatools(): Promise<number | commandLineArgs.CommandLineOptions> {
  const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: false });

  try {
    /* second - parse the merge command options */
    const args = mainOptions._unknown;
    switch (mainOptions.command) {
      case 'test': {
        console.log(mainOptions);
        return mainOptions;
      }
      case 'info': {
        if (args.length !== 1) {
          console.error('Expect one file as parameter!');
          return 1;
        } else {
          await info(args[0]);
        }
        return 0;
      }
      case 'archive': {
        const { src, dest, dryrun } = mainOptions as ArchiveCommandOptionType;
        await archive({ src, dest, dryrun });
        return 0;
      }
      case 'help':
      default: {
        const usage = commandLineUsage([
          {
            header: 'Welcome to media-tools',
            content: 'media-tools provides some specific and hopefully useful commands for media files.'
          },
          {
            header: 'Command List',
            content: [
              {
                name: '{bold archive}',
                summary: 'Archive all media files from a source folder to a destination folder.'
              },
              { name: '{bold help}', summary: 'Get this help information.' }
            ]
          },
          {
            header: 'Options for {underline archive}',
            optionList: [
              {
                name: 'src',
                typeLabel: '{underline src} ',
                description: 'Source folder'
              },
              {
                name: 'dest',
                typeLabel: '{underline dest} ',
                description: 'Destination folder'
              }
            ]
          }
        ]);
        console.log(usage);
        return 0;
      }
    }
  } catch (e) {
    console.error('Error occurred:', e);
  }
  return 1;
}
