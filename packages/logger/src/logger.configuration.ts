import { SeverityNumber } from '@opentelemetry/api-logs'

export class LoggerConfiguration {
  private static severityNumber: SeverityNumber

  private static debug: Array<string>

  static accept(severityNumber: SeverityNumber, debug?: string): boolean {
    if (debug && LoggerConfiguration.getDebug().includes(debug)) {
      return true
    }

    return severityNumber >= LoggerConfiguration.getSeverityNumber()
  }

  private static getSeverityNumber(): SeverityNumber {
    if (!LoggerConfiguration.severityNumber) {
      if (process.env.LOG_LEVEL) {
        LoggerConfiguration.severityNumber =
          SeverityNumber[process.env.LOG_LEVEL as keyof typeof SeverityNumber] !== undefined
            ? SeverityNumber[process.env.LOG_LEVEL as keyof typeof SeverityNumber]
            : SeverityNumber.INFO
      } else {
        LoggerConfiguration.severityNumber = SeverityNumber.INFO
      }
    }

    return LoggerConfiguration.severityNumber
  }

  private static getDebug(): Array<string> {
    if (!LoggerConfiguration.debug) {
      LoggerConfiguration.debug = (process.env.DEBUG || '').split(',')
    }

    return LoggerConfiguration.debug
  }
}
