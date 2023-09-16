import type { ExportResult }        from '@opentelemetry/core'
import type { ReadableLogRecord }   from '@opentelemetry/sdk-logs'

import { ExportResultCode }         from '@opentelemetry/core'
import { ConsoleLogRecordExporter } from '@opentelemetry/sdk-logs'

import { build }                    from './sonic-boom.utils.js'

export class SonicBoomLogRecordExporter extends ConsoleLogRecordExporter {
  #stream: { write: (record: string) => void }

  constructor() {
    super()

    this.#stream = build()
  }

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

      this.#stream.write(`${record}\n`)
    }

    done?.({ code: ExportResultCode.SUCCESS })
  }
}
