// This works under Jasmine 2.3
var slowSpecsReporter = {
  specStarted: function(result) {
    this.specStartTime = Date.now()
  },
  specDone: function(result) {
    var seconds = (Date.now() - this.specStartTime) / 1000
    if (seconds > 0.5) {
      console.log('WARNING - This spec took ' + seconds + ' seconds: "' + result.fullName + '"')
    }
  },
}
jasmine.getEnv().addReporter(slowSpecsReporter);