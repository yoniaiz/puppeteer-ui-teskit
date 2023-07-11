import { handleSkipAction } from '../handleSkipAction.js';
import { logger } from '../../../utils/logger.js';
import { logs } from '../constants.js';

describe('handleSkipAction', () => {
  it('Should log skip message', () => {
    handleSkipAction({
      filePath: 'path/to/file',
      snapName: 'snapshot',
      diffImageBuffer: Buffer.from('diff image data'),
      oldSnapImageBuffer: Buffer.from('old snapshot image data'),
      newSnapImageBuffer: Buffer.from('new snapshot image data'),
    });
    expect(logger.info).toHaveBeenCalledWith(logs.skipSnapshot('snapshot'));
  });
});
