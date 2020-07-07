const fs = require('fs');
const babylon = require('babylon');

module.exports = {
  getAST: (path) => { 
    const source = fs.readFileSync(path, 'utf-8');
    return babylon.parse(source, {
      sourceType: 'module'
    });
  },
  
}