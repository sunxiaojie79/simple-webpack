const { getAST, getDenpendencies, transform } = require('./parser');
const path = require('path');
const fs = require('fs');
module.exports = class Compiler { 
  constructor (options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
   }

  run () {
    const entryModule = this.buildModule(this.entry, true);
    this.modules.push(entryModule);
    this.modules.forEach(_module => {
      _module.dependencies.forEach(dependence => { 
        this.modules.push(this.buildModule(dependence))
      })
    })
    this.emitFiles();
   }

  buildModule (filename, isEntry) { 
    let ast;
    if (isEntry) {
      ast = getAST(filename)
    } else { 
      let absolutePath = path.join(process.cwd(), './src', filename);
      ast = getAST(absolutePath);
    }
    return {
      filename,
      dependencies: getDenpendencies(ast),
      transformCode: transform(ast)
    }
  }

  emitFiles () { 
    const output = path.join(this.output.path, this.output.filename);
    let modules = '';
    this.modules.forEach(module => {
      modules += `'${module.filename}': function(require, module, exports){${module.transformCode}},`
    })
    const bundle = `
      (function(modules){
        function require (filename) {
          var fn = modules[filename];
          var module = {exports: {}};
          fn(require, module, module.exports);
          return module.exports;
        }
        require('${this.entry}');
      })({${modules}})
    `;
    fs.writeFileSync(output, bundle, 'utf-8');
  }
}