import { assert } from 'chai';
import * as path from 'path';

describe('path-tests', function () {
  it('base-name-etc', async () => {
    assert.equal(path.extname('dfsdf-sdf-.jpg'), '.jpg');
    assert.equal(path.basename('dfsdf-sdf-.jpg', '.jpg'), 'dfsdf-sdf-');
  });
});
