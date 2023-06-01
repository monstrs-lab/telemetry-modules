import { SeverityNumber } from '@opentelemetry/api-logs'

export class LoggerConfiguration {
  private static severityNumber: SeverityNumber

  private static debug: Array<string>

  private static getSeverityNumber() {
    if (!LoggerConfiguration.severityNumber) {
      if (process.env.LOG_LEVEL) {
        LoggerConfiguration.severityNumber =
          SeverityNumber[process.env.LOG_LEVEL] >= 0
            ? SeverityNumber[process.env.LOG_LEVEL]
            : SeverityNumber.INFO
      } else {
        LoggerConfiguration.severityNumber = SeverityNumber.INFO
      }
    }

    return LoggerConfiguration.severityNumber
  }

  private static getDebug() {
    if (!LoggerConfiguration.debug) {
      LoggerConfiguration.debug = (process.env.DEBUG || '').split(',')
    }

    return LoggerConfiguration.debug
  }

  static accept(severityNumber: SeverityNumber, debug?: string) {
    if (debug && LoggerConfiguration.getDebug().includes(debug)) {
      return true
    }

    return severityNumber >= LoggerConfiguration.getSeverityNumber()
  }
}
