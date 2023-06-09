import { assert } from 'chai';
import * as path from 'path';
import * as fs from 'fs';
import { mediatools } from '../src/mediatools';

describe('path-tests', function () {
  it('base-name-etc', async () => {
    assert.equal(path.extname('dfsdf-sdf-.jpg'), '.jpg');
    assert.equal(path.basename('dfsdf-sdf-.jpg', '.jpg'), 'dfsdf-sdf-');
  });
});
