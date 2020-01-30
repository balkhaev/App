# DataLab

## NodeJS

```js
const { Store } = require('datalab');
const { httpAdapter } = require('datalab-http');

const store = new Store({
  adapter: httpAdapter,
});
```
