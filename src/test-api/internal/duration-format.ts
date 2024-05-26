import formatDuration from 'format-duration';

export const durationFormat = (startMillis: number, endMillis: number) => {
  return formatDuration(endMillis - startMillis, { ms: true });
};
