import { SeverityNumber } from '@opentelemetry/api-logs'

const severityTextByNumber: Record<number, keyof SeverityNumber> = Object.keys(
  SeverityNumber
).reduce(
  (result, key) => ({
    ...result,
    [SeverityNumber[key as keyof typeof SeverityNumber]]: key,
  }),
  {}
)

export const severityNumberToText = (severityNumber: number): string =>
  severityTextByNumber[severityNumber]
