export interface LoggerImplementation {
  debug<T>(message: T): T;
  info<T>(message: T): T;
  warn<T>(message: T): T;
  error<T>(message: T): T;
}

const nullLogger: LoggerImplementation = {
  debug<T>(message: T): T {
    return message;
  },

  info<T>(message: T): T {
    return message;
  },
  warn<T>(message: T): T {
    return message;
  },
  error<T>(message: T): T {
    return message;
  },
};

export class Logger {
  private static currentLogger: LoggerImplementation = nullLogger;

  static setLogger(logger: LoggerImplementation) {
    this.currentLogger = logger;
  }

  static removeLogger() {
    this.currentLogger = nullLogger;
  }

  static debug<T>(message: T): T {
    this.currentLogger.debug(message);
    return message;
  }

  static info<T>(message: T): T {
    this.currentLogger.info(message);
    return message;
  }

  static warn<T>(message: T): T {
    this.currentLogger.warn(message);
    return message;
  }

  static error<T>(message: T): T {
    this.currentLogger.error(message);
    return message;
  }
}
