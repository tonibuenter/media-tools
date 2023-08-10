import ffmpeg from 'fluent-ffmpeg';

const exifParser = require('exif-parser');

const fs = require('fs');
const moment = require('moment');

async function getInfo(filePath: string): Promise<Record<string, string>[]> {
  const fileInfo: Record<string, string>[] = [];
  try {
    const s = fs.statSync(filePath);
    fileInfo.push({ name: 'ctime', value: _toDate(s.ctime) });
    fileInfo.push({ name: 'atime', value: _toDate(s.atime) });
    fileInfo.push({ name: 'mtime', value: _toDate(s.mtime) });
    fileInfo.push({ name: 'birthtime', value: _toDate(s.birthtime) });
    addExifParserData(filePath, fileInfo);
    await addFfmpegData(filePath, fileInfo);
    return fileInfo;
  } catch (e) {
    fileInfo.push({ name: 'exception', value: e.message });
  }
  return fileInfo;
}

export async function info(filePath: string): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.log(`File '${filePath}' does not exist!`);
    return;
  }

  const fileInfo = await getInfo(filePath);
  console.log('File Info:', JSON.stringify(fileInfo, null, ' '));
}

function _toDate(value: Date | null): string {
  if (value) {
    return moment(value.getTime()).format('YYYY-MM-DD HH:mm:ss');
  }
  return '';
}

export function addExifParserData(file: string, data: Record<string, string>[]): void {
  try {
    const buff = fs.readFileSync(file);
    const parser = exifParser.create(buff);
    const result = parser.parse();

    const keys = Object.keys(result.tags);

    keys.forEach((k) => {
      data.push({ name: 'exif.tag.' + k, value: (result.tags[k] || '').toString() });
    });

    //data.push({ name: 'exif.tag.DateTimeOriginal', value: (result.tags.DateTimeOriginal || '').toString() });
    if (result.tags.DateTimeOriginal) {
      data.push({
        name: 'exif.tag.DateTimeOriginal.date',
        value: _toDate(new Date(+result.tags.DateTimeOriginal * 1000))
      });
    }
  } catch (e) {}
}

export function addFfmpegData(file: string, data: Record<string, string>[]): Promise<void> {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(file, function (err, metadata: any) {
      if (!err) {
        try {
          const keys = Object.keys(metadata.format.tags);

          keys.forEach((k) => {
            data.push({ name: 'metadata.format.tag.' + k, value: (metadata.format.tags[k] || '').toString() });
          });

          resolve();
        } catch (e) {
          resolve();
        }
      }
    });
  });
}
