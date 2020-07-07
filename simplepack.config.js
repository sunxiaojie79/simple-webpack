const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src'),
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist')
  }
}