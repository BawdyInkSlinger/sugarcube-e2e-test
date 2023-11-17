export const oneCondition = (
  eventName: string,
  conditional: (ev, data) => boolean,
  handler: (ev, data) => void
) => {
  $(document).on(eventName, (ev, data) => {
    const stopListening = conditional(ev, data);
    if (stopListening) {
      $(document).off(ev);
      handler(ev, data);
    }
  });
};
