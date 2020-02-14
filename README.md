# posthtml-img

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]

[PostHTML](https://github.com/posthtml/posthtml) plugin that manipulates `<img>` attributes.
It fetches remote image dimensions and sets `width` and `height` attributes.
You can also alter `src` and `alt` attributes based on image information.

Before:
``` html
<html>
  <body>
    <img src="https://www.kernel.org/theme/images/logos/tux.png">
  </body>
</html>
```

After:
``` html
<html>
  <body>
    <img src="https://www.kernel.org/theme/images/logos/tux.png" width="104" height="120">
  </body>
</html>
```

## Install

``` bash
npm i posthtml posthtml-img
```

## Usage

``` js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlImg = require('posthtml-img');

posthtml()
    .use(posthtmlImg({ /* options */ }))
    .process(html/*, options */)
    .then(result => fs.writeFileSync('./after.html', result.html));
```

## Options

### cache

Example:
``` js
const posthtml = require('posthtml');
const posthtmlImg = require('posthtml-img');

async function run() {
    const cache = {}; // cache object

    await posthtml()
        .use(posthtmlImg({ cache })
        .process('<div><img src="https://server.com/image.png"></div>');

    // the remote image info is already in cache, so 2nd run is faster
    await posthtml()
        .use(posthtmlImg({ cache })
        .process('<span><img src="https://server.com/image.png"></span>');
}
```

### changeAlt

Before:
``` html
<div>
  <img src="https://server.com/image.jpg">
</div>
```

Add option:
``` js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlImg = require('posthtml-img');

posthtml()
    .use(posthtmlImg({
      changeAlt: (alt, src, index) => 'This is an image.'
    }))
    .process(html)
    .then(result => fs.writeFileSync('./after.html', result.html));
```

After:
``` html
<div>
  <img src="https://server.com/image.jpg" width="120" height="40" alt="This is an image.">
</div>
```

### changeSrc

Before:
``` html
<div>
  <img src="https://server.com/image.jpg">
</div>
```

Add option:
``` js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlImg = require('posthtml-img');

posthtml()
    .use(posthtmlImg({
      changeSrc: (src, index) => src.replace('image.jpg', 'changed.png')
    }))
    .process(html)
    .then(result => fs.writeFileSync('./after.html', result.html));
```

After:
``` html
<div>
  <img src="https://server.com/changed.png" width="120" height="40">
</div>
```

### info

Plugin saves image information to given `options.info` array.

Before:
``` html
<div>
  <img src="https://server.com/image1.png">
  <img src="https://server.com/image2.jpg">
</div>
```

Add option:
``` js
const posthtml = require('posthtml');
const posthtmlImg = require('posthtml-img');

const info = [];

posthtml()
    .use(posthtmlImg({ info })
    .process(html)
    .then(() => console.log(info));
```

After:
``` html
<div>
  <img src="https://server.com/image1.png" width="183" height="200">
  <img src="https://server.com/image2.jpg" width="2432" width="4320">
</div>
```

`info` value:
``` js
[
  {
    height: 183,
    width: 200,
    type: 'png',
    fileSize: 15829,
    mediaType: 'image/png',
    src: 'https://server.com/image1.png'
  },
  {
    height: 2432,
    orientation: 1,
    width: 4320,
    type: 'jpg',
    fileSize: 6202507,
    mediaType: 'image/jpeg',
    src: 'https://server.com/image2.jpg'
  }
]
```

### Contributing

See [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs) and [contribution guide](CONTRIBUTING.md).

### License [MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml-img.svg
[npm-url]: https://npmjs.com/package/posthtml-img

[build]: https://travis-ci.org/iqqmuT/posthtml-img.svg?branch=master
[build-badge]: https://travis-ci.org/iqqmuT/posthtml-img?branch=master
