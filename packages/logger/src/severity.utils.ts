import { SeverityNumber } from '@opentelemetry/api-logs'

const severityTextByNumber = Object.keys(SeverityNumber).reduce(
  (result, key) => ({
    ...result,
    [SeverityNumber[key]]: key,
  }),
  {}
)

export const severityNumberToText = (severityNumber) => severityTextByNumber[severityNumber]
