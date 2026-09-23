import { noop } from 'lodash'
import { toast } from 'sonner'

type ClipboardText = string | Promise<string>

/**
 * Copy text content (string or Promise<string>) to the clipboard. Safari doesn't support writing text to the clipboard
 * asynchronously, so if you need to load text content asynchronously before copying, pass a Promise<string> as the
 * first argument.
 *
 * When the ClipboardItem write path is available but rejects, this helper falls back to writeText before reporting an
 * error. The optional callback runs after a successful write.
 *
 * IF YOU NEED TO CHANGE THIS FUNCTION, PLEASE TEST IT IN SAFARI with a promised string. Expiring URL to a file in a
 * private bucket will do.
 *
 * Copied code from https://wolfgangrittner.dev/how-to-use-clipboard-api-in-firefox/
 */
export const copyToClipboard = async (str: ClipboardText, callback = noop) => {
  const focused = window.document.hasFocus()
  if (!focused) {
    toast.error('Unable to copy to clipboard')
    return
  }

  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      let richWriteSucceeded = false

      try {
        // NOTE: Safari locks down the clipboard API to only work when triggered
        // by a direct user interaction. You can't use it async in a promise.
        // But! You can wrap the promise in a ClipboardItem, and give that to
        // the clipboard API.
        // Found this on https://developer.apple.com/forums/thread/691873
        const text = new ClipboardItem({
          'text/plain': Promise.resolve(str).then(
            (text) => new Blob([text], { type: 'text/plain' })
          ),
        })

        await navigator.clipboard.write([text])
        richWriteSucceeded = true
      } catch {
        // Safari can expose clipboard.write() and still reject it. Fall back to
        // writeText() before reporting that copying failed.
      }

      if (richWriteSucceeded) {
        callback()
        return
      }
    }

    if (!navigator.clipboard) throw new Error('Clipboard API unavailable')

    // NOTE: Firefox has support for ClipboardItem and navigator.clipboard.write,
    // but those are behind `dom.events.asyncClipboard.clipboardItem` preference.
    // Good news is that other than Safari, Firefox does not care about
    // Clipboard API being used async in a Promise.
    await Promise.resolve(str).then((text) => navigator.clipboard.writeText(text))
    callback()
  } catch {
    toast.error('Unable to copy to clipboard')
  }
}
