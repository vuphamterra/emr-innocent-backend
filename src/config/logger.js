// Plan :
// 1. Logging to a specific folder path
// 2. Have different types of logging filter
// Tenancy, specific user or URL based logging debug
// Enabling performance for each Api call to be logged


// References:
// check this out - https://gist.github.com/ludwig/b47b5de4a4c53235825af3b4cef4869a



const dotenv = require('dotenv');
dotenv.config();
var logRoot = process.env.LogFolderPath;
var winston = require('winston');

const { splat, combine, timestamp, printf } = winston.format;

// meta param is ensured by splat()
const myFormat = printf(({ timestamp, level, message, meta }) => {
  return `${timestamp};${level};${message};${meta? JSON.stringify(meta) : ''}`;
});

const getLabel = function(callingModule) {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'debug',
    // filename: `${appRoot}/emr_app.log`,
    // label: getLabel(callingModule),
    filename: logRoot+'emr_app.log',
    handleExceptions: true,
    // json: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true,
  },
  console: {
    // label: getLabel(callingModule),
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
  },
};


// var logger = new winston.Logger({
  const logger = winston.createLogger({
  format: combine(
    timestamp(),
    splat(),
    myFormat
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

logger.stream = {
  write: function (message) {
    logger.info(message)
  }
}

// A custom logger interface that wraps winston, making it easy to instrument
// code and still possible to replace winston in the future.

module.exports.debug = module.exports.log = function () {
  logger.debug.apply(logger, formatLogArguments(arguments))
}

module.exports.info = function () {
  logger.info.apply(logger, formatLogArguments(arguments))
}

module.exports.warn = function () {
  logger.warn.apply(logger, formatLogArguments(arguments))
}

module.exports.error = function () {
  logger.error.apply(logger, formatLogArguments(arguments))
}

module.exports.stream = logger.stream

/**
 * Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments (args) {
  args = Array.prototype.slice.call(args)

  var stackInfo = getStackInfo(1)

  if (stackInfo) {
    // get file path relative to project root
    var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')'

    if (typeof (args[0]) === 'string') {
      args[0] = calleeStr + ' ' + args[0]
    } else {
      args.unshift(calleeStr)
    }
  }

  return args
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo (stackIndex) {
  // get call stack, and analyze it
  // get all file, method, and line numbers
  var stacklist = (new Error()).stack.split('\n').slice(3)

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

  var s = stacklist[stackIndex] || stacklist[0]
  var sp = stackReg.exec(s) || stackReg2.exec(s)

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    }
  }
}

logger.info('Logging setup testing...');

module.exports = logger;
