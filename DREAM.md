# My dream

`frontend/.env`

```
SERVICE_UPLOAD_ENDPOINT=/api/upload
```

`frontend/.env.dev`

```
SERVICE_UPLOAD_ENDPOINT=https://upload.mvs.wtf/upload
```

```js
import uplo from 'bb-uplo-sdk'; // upload service sdk
import Auth from 'bb-athy-sdk'; // auth service sdk

const uploader = uplo(process.env.SERVICE_UPLOAD_ENDPOINT, {
  allowedTypes: ['jpg/image'],
});

const auth = new Auth(
  {
    login: '/api/login',
    signup: '/api/signup',
    profile: '/api/profile',
  },
  {
    anon: {
      id: 0,
      username: 'Guest',
    },
  }
);

document.querySelector('#file-input').addEventListener('change', e => {
  uploader.upload(e.files[0]).then(file => {
    alert(`File ${file.name} uploaded! Link: ${file.url}`);
  });
});

document.querySelector('#login-form').addEventListener('submit', e => {
  e.preventDefault();

  const data = auth.formData(e.target);

  auth
    .login(data.login, data.password)
    .then(user => {
      window.location.replace('/');
    })
    .catch(e => {
      window.location.replace('/login?msg=' + e.message);
    });
});
```

### Uploader SDK

```js
function createUplo(endpoint, opts = {}) {
  const { allowedTypes } = opts;

  return {
    upload(file) {
      const formData = new FormData();

      formData.append('file', file);

      const response = await fetch(endpoint, {
        method: 'PUT',
        body: formData
      });

      return await response.json();
    }
  }
}

export default createUplo;
```

### Auth SDK

```js
class Auth {
  constructor(endpoints, opts = {}) {
    const {
      key = 'bb-auth',
      anon = null,
      loginFields = ['login', 'email', 'username'],
      passwordFields = ['password', 'pass', 'passwd'],
      storage = {
        get(key) {
          localStorage.getItem(key)
        },
        set(key, value) {
          localStorage.setItem(key, value)
        },
        remove(key) {
          localStorage.removeItem(key)
        }
      }
    } = opts;

    this._key = key;
    this._anon = anon;
    this._storage = storage;
    this._loginFields = loginFields;
    this._passwdFields = passwordFields;

    this.loginEndpoint = endpoints.login;
    this.signupEndpoint = endpoints.signup;
    this.profileEndpoint = endpoints.profile;

    this.token = JSON.parse(storage.get(this.key));
    this.currentUser = anon;

    if (this.token) {
      this.check();
    }
  }

  async login(login, password) {
    const { token, ...user } = await this.request(this.loginEndpoint, { data: { login, password } });

    this.currentUser = user;
    this.saveToken(token);
  }

  async signup(login, password, data = {}) {
    const { token, ...user } = await this.request(this.ensignupEndpoint, { data: { login, password, ...data } });

    this.currentUser = user;
    this.saveToken(token);
  }

  async check() {
    const { token, ...user } = await this.request(this.profileEndpoint, { method: 'GET' });

    this.currentUser = user;
    this.saveToken(token);
  }

  logout() {
    this.currentUser = this._anon;
    this.removeToken();
  }

  saveToken(token) {
    this.token = token;

    this._storage.set(this._key, token);
  }

  removeToken() {
    this.token = null;

    this._storage.remove(this._key);
  }

  request(url, opts = {}) {
    const { data, method = 'POST' } = opts;

    const req = {
      method,
      headers: {},
    };

    if (this.token) {
      req.headers.Authorization = this.token;
    }

    if (data) {
      req.headers['Content-Type'] = 'application/json';
      req.body = JSON.stringify(data);
    }

    const res = await fetch(url, req);

    if (!res.ok) {
      const error = new Error('Request failed');

      error.code = res.status;
      error.headers = res.headers;
      error.response = await res.text();
      error.statusText = res.statusText;

      throw error;
    }

    return await res.json();
  }

  formData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const loginField = this._loginFields.find(loginField => loginField in data);
    const passwdField = this._passwdFields.find(passField => passField in data);

    if (typeof loginField === 'undefined') {
      throw new Error('Login field not found, please use one of: ' + this._loginFields.join(', '));
    }
    if (typeof passwdField === 'undefined') {
      throw new Error('Password field not found, please use on of: ' + this._passwdFields.join(', '));
    }

    return { login: data[loginField], password: data[passwdField] };
  }
}
```
