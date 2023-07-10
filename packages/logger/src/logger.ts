import type { LoggerOptions }              from '@opentelemetry/api-logs'
import type { LogRecord }                  from '@opentelemetry/api-logs'
import type { Attributes }                 from '@opentelemetry/api'
import type { Context }                    from '@opentelemetry/api'

import { SeverityNumber }                  from '@opentelemetry/api-logs'

import { LoggerConfiguration }             from './logger.configuration.js'
import { LOGGER_NAMESPACE_ATTRIBUTE_NAME } from './logger.constants.js'
import { LoggerApi }                       from './logger.api.js'
import { severityNumberToText }            from './severity.utils.js'

export class Logger {
  constructor(
    private readonly name: string = 'default',
    private readonly attributes: Attributes = {},
    private readonly version?: string,
    private readonly options?: LoggerOptions
  ) {}

  unspecified(body: string, attributes?: Attributes, context?: Context): void {
    this.log(SeverityNumber.UNSPECIFIED, body, attributes, context)
  }

  trace(body: string, attributes?: Attributes, context?: Context): void {
    this.log(SeverityNumber.TRACE, body, attributes, context)
  }

  debug(body: string, attributes?: Attributes, context?: Context): void {
    this.log(SeverityNumber.DEBUG, body, attributes, context)
  }

  info(body: string, attributes?: Attributes, context?: Context): void {
    this.log(SeverityNumber.INFO, body, attributes, context)
  }

  warn(body: string, attributes?: Attributes, context?: Context): void {
    this.log(SeverityNumber.WARN, body, attributes, context)
  }

  error(body: Error | string, attributes?: Attributes, context?: Context): void {
    if (body instanceof Error) {
      this.log(
        SeverityNumber.ERROR,
        body.message,
        {
          ...(attributes || {}),
          '@stack': body.stack,
        },
        context
      )
    } else {
      this.log(SeverityNumber.ERROR, body, attributes, context)
    }
  }

  fatal(body: string, attributes?: Attributes, context?: Context): void {
    this.log(SeverityNumber.FATAL, body, attributes, context)
  }

  log(
    severityNumber: SeverityNumber,
    body: string,
    attributes?: Attributes,
    context?: Context
  ): void {
    if (LoggerConfiguration.accept(severityNumber, this.name)) {
      LoggerApi.getLoggerProvider()
        .getLogger(this.name, this.version, this.options)
        .emit(this.buildRecord(severityNumber, body, attributes, context))
    }
  }

  child(name: string, attributes: Attributes = {}): Logger {
    return new Logger([this.name, name].filter(Boolean).join(':'), {
      ...this.attributes,
      ...attributes,
    })
  }

  protected buildRecord(
    severityNumber: SeverityNumber,
    body: string,
    attributes: Attributes = {},
    context?: Context
  ): LogRecord {
    return {
      severityText: severityNumberToText(severityNumber),
      severityNumber,
      attributes: {
        ...this.attributes,
        ...attributes,
        [LOGGER_NAMESPACE_ATTRIBUTE_NAME]: this.name,
      },
      context,
      body,
    }
  }
}
