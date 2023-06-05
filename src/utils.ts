import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

const exifParser = require('exif-parser');

export function getMP4CreationTime(file: string): Promise<number | undefined> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, function (err, metadata: any) {
      if (err) {
        console.error(err);
        resolve(undefined);
      } else {
        try {
          const d = new Date(metadata.format.tags.creation_time);
          resolve(d.getTime());
        } catch (e) {
          resolve(undefined);
        }
      }
    });
  });
}

export function getJPGCreationTime(file: string): number | undefined {
  try {
    const buff = fs.readFileSync(file);
    const parser = exifParser.create(buff);
    const result = parser.parse();
    return +result.tags.DateTimeOriginal * 1000;
  } catch (e) {}
  return undefined;
}
