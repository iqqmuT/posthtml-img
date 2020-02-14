'use strict'

const Bottleneck = require('bottleneck')
const fetchInfo = require('remote-file-info')

module.exports = function (options) {
  const defaultOptions = {
    // prevent more than N requests running at a time
    bottleNeckMaxConcurrent: 5,

    // each request takes at least minTime (ms) so
    // this code will not hit the servers too frequently
    bottleNeckMinTime: 100,
    cache: {}
  }

  const opts = {
    ...defaultOptions,
    ...options
  }

  // validate options
  if (opts.info && !Array.isArray(opts.info)) {
    throw new Error('posthtml-img: option info must be an array')
  } else if (opts.cache && typeof opts.cache !== 'object') {
    throw new Error('posthtml-img: option cache must be an object')
  } else if (opts.changeAlt && typeof opts.changeAlt !== 'function') {
    throw new Error('posthtml-img: option changeAlt must be a function')
  } else if (opts.changeSrc && typeof opts.changeSrc !== 'function') {
    throw new Error('posthtml-img: option changeSrc must be a function')
  }

  // rate limiter to prevent excessive fetching
  const limiter = new Bottleneck({
    maxConcurrent: opts.bottleNeckMaxConcurrent,
    minTime: opts.bottleNeckMinTime
  })

  async function handleImage (node, index) {
    if (!node.attrs.src) {
      return false
    }

    let fileInfo = opts.cache[node.attrs.src]
    if (fileInfo === undefined) {
      // fetch image info from remote server and use Bottleneck
      // to limit request rate
      fileInfo = await limiter.schedule(
        () => fetchInfo(node.attrs.src, { isImage: true })
      )

      // write into cache
      opts.cache[node.attrs.src] = fileInfo
    }

    const imgInfo = { ...fileInfo }

    node.attrs.width = fileInfo.width
    node.attrs.height = fileInfo.height
    if (opts.changeAlt) {
      node.attrs.alt = opts.changeAlt(node.attrs.alt, node.attrs.src, index)
    }

    if (opts.changeSrc) {
      imgInfo.origSrc = node.attrs.src
      node.attrs.src = opts.changeSrc(node.attrs.src, index)
    }

    imgInfo.src = node.attrs.src

    if (opts.info) {
      // save image information into 'info' array given in options
      opts.info[index] = imgInfo
    }

    return true
  }

  return async function posthtmlImg (tree) {
    const promises = []
    let idx = -1
    tree.match({ tag: 'img' }, (node) => {
      promises.push(handleImage(node, ++idx))
      return node
    })

    // wait all promises to be resolved
    await Promise.all(promises)

    return tree
  }
}
