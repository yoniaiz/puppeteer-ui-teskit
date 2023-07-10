import { getDirName } from '../../utils/getDirName.js';

export const getTempFolder = () => `${getDirName(import.meta.url)}/.tmp`;
