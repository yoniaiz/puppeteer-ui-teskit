import { getDirName } from '../../utils/getDirName';

export const getTempFolder = () => `${getDirName(import.meta.url)}/.tmp`;
