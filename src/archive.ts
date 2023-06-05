const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { getMP4CreationTime, getJPGCreationTime } = require('./utils');

const audioExtensions = ['wav', 'mp3'];

const photoExtensions = ['jpg', 'jpeg', 'dng', 'png', 'gif', 'pdf', 'cr2'];

const filmExtensions = ['mts', '3gp', 'avi', 'mpg', 'mpeg', 'mp4', 'mov', 'm4v'];

type ArchiveMediaFilesArgs = { src: string; dest: string; extensions: string[]; dirPrefix: string; dryrun?: boolean };

async function archiveMediaFiles({ src, dest, extensions, dirPrefix, dryrun }: ArchiveMediaFilesArgs) {
  const files: string[] = [];
  readDirRecursively(src, files, extensions);

  console.log(`Found ${files.length} media files with extensions ${extensions.join('')}`);

  let createdFilesCounter = 0;
  let copyErrorCounter = 0;
  let fileSizeSum = 0;

  for (const file of files) {
    const stats = fs.statSync(file);
    if (!stats.isDirectory()) {
      try {
        const t1 = getJPGCreationTime(file);
        const t2 = await getMP4CreationTime(file);
        const d = new Date(t1 || t2 || new Date(stats.ctime));
        const mdate = moment(d);

        const modifedYear = mdate.format('YYYY');
        const modifedDate = mdate.format('YYYYMMDD');
        const outDir = path.join(dest, `${dirPrefix}${modifedYear}`, modifedDate);
        fileSizeSum += stats.size;

        const extension = path.extname(file).toLowerCase();
        const baseName = path.basename(file, extension).toLowerCase();
        const dateString = mdate.format('YYYY_MM_DD__HH_mm');
        const destFile = path.join(outDir, `${dateString}-${baseName}${extension}`);
        if (fs.existsSync(destFile)) {
          console.log(`The file ${path.basename(destFile)} already exists in ${path.dirname(destFile)}!`);
        } else {
          console.log(`Create/copy file ${path.basename(destFile)} in ${path.dirname(destFile)}`);

          if (!dryrun) {
            copyMediaFile(outDir, file, destFile) ? createdFilesCounter++ : copyErrorCounter++;
          } else {
            console.log(`File ${file}  destFile: ${destFile}`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  console.log('Nr of files       : ', files.length);
  console.log('Size of all files : ', Math.floor(fileSizeSum / 1024 / 1024) + 'M ' + (fileSizeSum % 1024) + 'KB');
  console.log('Created files     : ', createdFilesCounter);
  console.log('Copy errors       : ', copyErrorCounter);
}

type ArchiveArgs = { src: string; dest: string; dryrun?: boolean };

export async function archive({ src, dest }: ArchiveArgs): Promise<number> {
  // console.log('sources:');
  if (!fs.existsSync(src)) {
    console.log('Source directory does not exist!');
    return 1;
  }

  console.log('Media source directory: ', src);
  console.log('Media destination directory: ', dest);

  await archiveMediaFiles({ src, dest, extensions: audioExtensions, dirPrefix: 'audio' });
  await archiveMediaFiles({ src, dest, extensions: photoExtensions, dirPrefix: 'album' });
  await archiveMediaFiles({ src, dest, extensions: filmExtensions, dirPrefix: 'film' });
  return 0;
}

function readDirRecursively(dir: string, fileList: string[], extensions: string[]) {
  const files: string[] = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readDirRecursively(filePath, fileList, extensions);
    } else {
      const basename = path.basename(file);
      const extname = path.extname(file).toLowerCase().replace('.', '');
      if (!basename.startsWith('.') && extensions.includes(extname)) {
        fileList.push(filePath);
      }
    }
  });
}

function copyMediaFile(outDir: string, file: string, destFile: string): boolean {
  try {
    fs.mkdirSync(outDir, { recursive: true });
    fs.copyFileSync(file, destFile);
    return true;
  } catch (e1) {
    console.error(`Can not copy : ${file} to ${destFile}`);
    console.error(e1);
    return false;
  }
}
