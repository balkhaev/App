module.exports = require('fs')
  .readdirSync(__dirname)
  .reduce((acc, filename) => {
    if (filename === 'index.js') {
      return acc;
    }

    const [name] = filename.split('.');

    return {
      ...acc,
      [name]: require(__dirname + '/' + filename),
    };
  }, {});
