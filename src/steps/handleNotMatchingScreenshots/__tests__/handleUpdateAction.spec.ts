import { handleUpdateAction } from '../handleUpdateAction';
import { logger } from '../../../utils/logger';
import { fsMocks } from '../../../test/fsMocks';
import { pathMocks } from '../../../test/pathMocks';
import { logs } from '../constants';
import {
  TESTKIT_FILE_NAME,
  TESTKIT_FOLDER_NAME,
} from '../../../constants/testkit.constants';

describe('handleUpdateAction', () => {
  it('Should log and update snapshot', async () => {
    const writeFileMock = fsMocks.promises.writeFile();
    pathMocks.resolve();

    await handleUpdateAction({
      filePath: 'path/to',
      snapName: 'name',
      description: 'description',
      newSnapImageBuffer: Buffer.from(''),
      diffImageBuffer: Buffer.from(''),
      oldSnapImageBuffer: Buffer.from(''),
    });
    expect(logger.info).toHaveBeenCalledWith(logs.updateSnapshot('name'));
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledWith(
      `path/${TESTKIT_FOLDER_NAME}/name-description.${TESTKIT_FILE_NAME}.png`,
      Buffer.from(''),
      'binary',
    );
  });
});
