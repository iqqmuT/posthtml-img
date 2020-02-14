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
  const info = []
  return compare(t, 'info', {
    cache,
    info
  }, () => {
    t.truthy(info.length === 2 &&
      info[0].height > 0 &&
      info[0].width > 0 &&
      info[1].height > 0 &&
      info[1].width > 0
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
