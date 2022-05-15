export default {
  copyElementToClipboard(element) {
    // Before we copy, we are going to select the text.
    const text = document.getElementById(element)
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(text)
    selection.removeAllRanges()
    selection.addRange(range)
    // add to clipboard.
    document.execCommand('copy')
  },
}
