import { DEBUG_SUGARCUBE_PARSER_TESTS_KEY } from '../../../../test/init-logger';
import { Category, getLogger } from '../../../logger';
import { innerTextHelper } from './inner-text-helper';

const testLogger = getLogger(DEBUG_SUGARCUBE_PARSER_TESTS_KEY as Category);

export const innerText = (el: Node): string => {
  const { result, debugDataTable } = innerTextHelper(el);

  if (testLogger.isDebugEnabled()) {
    console.table(
      debugDataTable.map((datum) => {
        return {
          ...datum,
          nodeText: JSON.stringify(datum.nodeText).replaceAll(/ /g, '·'),
        };
      })
    );
  }

  return result;
};
