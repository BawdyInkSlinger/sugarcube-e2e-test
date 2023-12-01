jasmine.getEnv().addReporter({
  specDone: function (result) {
    if (result.status !== 'excluded') {
      console.log(result.fullName);
    }
  },
});
