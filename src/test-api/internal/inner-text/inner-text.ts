import { DEBUG_SUGARCUBE_PARSER_TESTS_KEY } from '../../../../test/init-logger';
import { Category, getLogger } from '../../../logger';
import { innerTextHelper } from './inner-text-helper';

const testLogger = getLogger(DEBUG_SUGARCUBE_PARSER_TESTS_KEY as Category);

export const innerText = (el: Node): string => {
  const { result, debugDataTable } = innerTextHelper(el);

  if (testLogger.isDebugEnabled()) {
    debugDataTable.print();
  }

  return result;
};
