import type { LoggerProvider as ApiLoggerProvider } from '@opentelemetry/api-logs'

import { NoopLoggerProvider }                       from '@opentelemetry/api-logs'
import { LoggerProvider }                           from '@opentelemetry/sdk-logs'
import { SimpleLogRecordProcessor }                 from '@opentelemetry/sdk-logs'
import { logs }                                     from '@opentelemetry/api-logs'

import { ConsoleLogRecordExporter }                 from './console-log-record.exporter.js'
import { SonicBoomLogRecordExporter }               from './sonic-boom-log-record.exporter.js'

export class LoggerApi {
  private static initialized: boolean = false

  static getLoggerProvider(): ApiLoggerProvider {
    if (!LoggerApi.initialized) {
      if (logs.getLoggerProvider() instanceof NoopLoggerProvider) {
        const loggerProvider = new LoggerProvider()

        loggerProvider.addLogRecordProcessor(
          new SimpleLogRecordProcessor(
            process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID
              ? new ConsoleLogRecordExporter()
              : new SonicBoomLogRecordExporter()
          )
        )

        logs.setGlobalLoggerProvider(loggerProvider)

        LoggerApi.initialized = true
      }
    }

    return logs.getLoggerProvider()
  }
}
