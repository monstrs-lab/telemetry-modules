/* copied from pino */
/* eslint-disable */

import { isMainThread } from 'node:worker_threads'

import SonicBoomPkg     from 'sonic-boom'
import onExit           from 'on-exit-leak-free'

const SonicBoom = SonicBoomPkg.default || SonicBoomPkg

function noop() {}

function autoEnd(stream, eventName) {
  if (stream.destroyed) {
    return
  }

  if (eventName === 'beforeExit') {
    stream.flush()
    stream.on('drain', () => {
      stream.end()
    })
  } else {
    stream.flushSync()
  }
}

export const build = () => {
  const stream = new SonicBoom({ fd: process.stdout.fd || 1 })

  stream.on('error', filterBrokenPipe)

  if (isMainThread) {
    onExit.register(stream, autoEnd)

    stream.on('close', () => {
      onExit.unregister(stream)
    })
  }

  function filterBrokenPipe(err) {
    if (err.code === 'EPIPE') {
      // @ts-ignore
      stream.write = noop
      stream.end = noop
      stream.flushSync = noop
      stream.destroy = noop
      return
    }

    stream.removeListener('error', filterBrokenPipe)
    stream.emit('error', err)
  }

  return stream
}
