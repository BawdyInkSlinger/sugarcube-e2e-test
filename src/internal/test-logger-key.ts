export const DEBUG_SUGARCUBE_PARSER_TESTS_KEY = 'DEBUG_SUGARCUBE_PARSER_TESTS';

// side effect so users don't see internal test logs
// tests will overwrite this
process.env[`logger.DEBUG_SUGARCUBE_PARSER_TESTS.level`] = `error`; 
