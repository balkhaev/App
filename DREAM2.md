# DataLab

## NodeJS

```js
const { Store, types, fields } = require('datalab');
const { HttpAdapter } = require('datalab-http');
// const { localstorageAdapter } = require('datalab-localstore');

const adapter = new HttpAdapter('/api');
const store = new Store({
  adapter,
});

const User = store.model(
  'User',
  {
    username: types.String,
    firstName: {
      type: types.String,
      required: true,
    },
    lastName: {
      type: types.String,
      required: true,
    },
    follows: {
      type: [types.Ref],
      ref: 'User',
    },
    createdAt: fields.createdAt,
    updatedAt: fields.updatedAt,
  },
  {
    follow(userId) {
      this.follows.push(userId);

      return this.save();
    },
  }
);

const frenk = await User.create({
  username: 'Rofler228',
  firstName: 'Frenk',
  lastName: 'Bekmamov',
});

const mattew = await User.create({
  username: 'PapaBiznes',
  firstName: 'Mattew',
  lastName: 'Makkonohi',
});

await frenk.follow(mattew.id);
```

`fields.createdAt`

```js
{
  type: types.DateTime,
  default: () => Date.now()
}
```

`fields.updatedAt`

```js
{
  type: types.DateTime,
  default: () => Date.now(),
  hooks: {
    afterUpdate: () => Date.now()
  }
}
```

`store`

```js
function throwRequired(fieldname) {
  throw new Error(fieldname + ' required!');
}

class Store {
  constructor(opts) {
    const { adapter = throwRequired('adapter'), models = {} } = opts;

    this.adapter = adapter;
    this._models = models;
  }

  model(modelName, schema, methods) {
    if (typeof schema === 'undefined') {
      return this.getModel(modelName);
    }

    this._models[modelName] = this.createModel(schema, methods);
  }

  getModel(modelName) {
    if (!this.existsModel(modelName)) {
      throw new Error('Unknown model ' + modelName);
    }

    return this._models[modelName];
  }

  existsModel(modelName) {
    return modelName in this._models;
  }

  createModel() {
    //...
  }
}
```

`adapter`

```js
class Adapter {
  constructor() {}
}

class HttpAdapter extends Adapter {
  constructor(uri) {
    this.baseUri = uri;
  }
}
```
