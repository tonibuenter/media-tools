import { assert } from 'chai';
import * as path from 'path';
import * as fs from 'fs';
import { mediatools } from '../src';

describe('archive', function () {
  const projectDir = process.cwd();
  const src = path.join(projectDir, 'test', 'data', 'src');
  const dest = path.join(projectDir, 'temp', 'dest');
  before(() => {
    try {
      fs.rmSync(dest, { recursive: true, force: true });
    } catch (e) {
      console.debug(e);
    }
    fs.mkdirSync(dest, { recursive: true });
  });

  after(() => {
    fs.rmSync(dest, { recursive: true, force: true });
  });

  it('option test', async () => {
    process.argv = ['node', 'test.js', 'test', '--src', src, '--dest', dest];
    const options = await mediatools();
    assert.isTrue(!!options);
    assert.isTrue(options['command'] === 'test');
    assert.equal(src, options['src']);
    assert.equal(dest, options['dest']);
  });

  it('testing --archive with real data', async () => {
    this.timeout(10000);
    process.argv = ['node', 'test.js', 'archive', '--src', src, '--dest', dest];
    await mediatools();

    assert.isTrue(fs.existsSync(src), 'does src exist?');
    assert.isTrue(fs.existsSync(dest), 'does dest exist?');
    assert.isTrue(fs.existsSync(path.join(dest, 'album2023')), 'does album2023 exist?');
    assert.isTrue(fs.existsSync(path.join(dest, 'film2022')), 'does file2022 exist?');
    assert.isTrue(fs.existsSync(path.join(dest, 'audio2023')), 'does audio2023 exist?');
    assert.isFalse(fs.existsSync(path.join(dest, 'audio1970')), 'does audio 1970 not exist?');
    assert.isFalse(fs.existsSync(path.join(dest, 'film1700')), 'does film1700 not exist?');
    assert.isFalse(fs.existsSync(path.join(dest, 'album1700')), 'does album1700 not exist?');

    const destDirs = fs.readdirSync(dest);

    console.debug('destDirs', destDirs);
  });
});
