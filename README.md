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

> npm i posthtml posthtml-img

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

### Contributing

See [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs) and [contribution guide](CONTRIBUTING.md).

### License [MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml-img.svg
[npm-url]: https://npmjs.com/package/posthtml-img

[build]: https://travis-ci.org/iqqmuT/posthtml-img.svg?branch=master
[build-badge]: https://travis-ci.org/iqqmuT/posthtml-img?branch=master
