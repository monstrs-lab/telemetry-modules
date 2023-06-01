import { SeverityNumber } from '@opentelemetry/api-logs'
import { describe }       from '@jest/globals'
import { beforeEach }     from '@jest/globals'
import { it }             from '@jest/globals'
import { expect }         from '@jest/globals'
import { jest }           from '@jest/globals'

describe('logger.configuration', () => {
  const { env } = process

  beforeEach(async () => {
    jest.resetModules()

    process.env = { ...env }
  })

  it('check accept default', async () => {
    const { LoggerConfiguration } = await import('./logger.configuration.js')

    expect(LoggerConfiguration.accept(SeverityNumber.INFO)).toBe(true)
  })

  it('check accept less level', async () => {
    const { LoggerConfiguration } = await import('./logger.configuration.js')

    expect(LoggerConfiguration.accept(SeverityNumber.DEBUG)).toBe(false)
  })

  it('check accept env configuration', async () => {
    process.env.LOG_LEVEL = 'DEBUG'

    const { LoggerConfiguration } = await import('./logger.configuration.js')

    expect(LoggerConfiguration.accept(SeverityNumber.DEBUG)).toBe(true)
  })

  it('check accept less level env configuration', async () => {
    process.env.LOG_LEVEL = 'DEBUG1'

    const { LoggerConfiguration } = await import('./logger.configuration.js')

    expect(LoggerConfiguration.accept(SeverityNumber.DEBUG)).toBe(false)
  })

  it('check accept debug', async () => {
    process.env.DEBUG = 'test'

    const { LoggerConfiguration } = await import('./logger.configuration.js')

    expect(LoggerConfiguration.accept(SeverityNumber.DEBUG, 'test')).toBe(true)
  })
})
