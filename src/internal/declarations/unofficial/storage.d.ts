import { Adapter } from '../../fakes/adapter';

declare global {
  // eslint-disable-next-line no-var
  var storage: Adapter;
}
