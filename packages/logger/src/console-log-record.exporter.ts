import type { ExportResult }                                        from '@opentelemetry/core'
import type { ReadableLogRecord }                                   from '@opentelemetry/sdk-logs'

import { ExportResultCode }                                         from '@opentelemetry/core'
import { ConsoleLogRecordExporter as BaseConsoleLogRecordExporter } from '@opentelemetry/sdk-logs'

export class ConsoleLogRecordExporter extends BaseConsoleLogRecordExporter {
  public override export(
    logs: Array<ReadableLogRecord>,
    resultCallback: (result: ExportResult) => void
  ): void {
    this.sendLogRecords(logs, resultCallback)
  }

  private sendLogRecords(
    logRecords: Array<ReadableLogRecord>,
    done?: (result: ExportResult) => void
  ): void {
    for (const logRecord of logRecords) {
      // @ts-expect-error
      const record = JSON.stringify(this._exportInfo(logRecord)) // eslint-disable-line

      process.stdout.write(`${record}\n`)
    }

    done?.({ code: ExportResultCode.SUCCESS })
  }
}
