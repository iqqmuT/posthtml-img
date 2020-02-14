'use strict'

const test = require('ava')
const plugin = require('..')
const { readFileSync } = require('fs')
const path = require('path')
const posthtml = require('posthtml')
const fixtures = path.join(__dirname, 'fixtures')

const cache = {}

test('basic', (t) => {
  return compare(t, 'basic', {
    cache
  })
})

test('cached basic', (t) => {
  return compare(t, 'basic', {
    cache
  })
})

test('src and alt changed', (t) => {
  return compare(t, 'src', {
    cache,
    changeSrc: src => src.toUpperCase(),
    changeAlt: (alt, src, index) => `${index}_${alt}_${src}`
  })
})

test('image info is retrieved', (t) => {
  const infos = []
  return compare(t, 'info', {
    cache,
    onInfo: (info, index) => {
      infos[index] = info
    }
  }, () => {
    t.truthy(infos.length === 2 &&
      infos[0].height > 0 &&
      infos[0].width > 0 &&
      infos[0].src === 'https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png' &&
      infos[1].height > 0 &&
      infos[1].width > 0
    )
  })
})

function compare (t, name, options, after) {
  const html = readFileSync(path.join(fixtures, `${name}.html`), 'utf8')
  const expected = readFileSync(path.join(fixtures, `${name}.expected.html`), 'utf8')

  return posthtml([plugin(options)])
    .process(html)
    .then((res) => {
      t.truthy(res.html === expected)
      if (after) {
        after()
      }
    })
}
