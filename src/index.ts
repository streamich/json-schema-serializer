import {TypeSome} from './types';

const generate = (schema: TypeSome, fn: string[] = []): string => {
  switch (schema.type) {
    case 'object': {
      const optional = schema.optional || [];
      let code = '(function(v){var c=0,j="{";';
      const keys = Object.keys(schema.properties);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const isOptional = optional.indexOf(key) > -1;
        if (isOptional) {
          code += /* js */ `if (v[${JSON.stringify(key)}] !== undefined) j+=(c>0?',':'')+${JSON.stringify(JSON.stringify(key))}+":"+${generate(schema.properties[key], fn)}(v[${JSON.stringify(key)}]);c++;`;
        } else {
          code += /* js */ `j+=(c>0?',':'')+${JSON.stringify(JSON.stringify(key))}+":"+${generate(schema.properties[key], fn)}(v[${JSON.stringify(key)}]);c++;`;
        }
      }
      code += /* js */ `return j+'}'})`;
      const f = 'f' + fn.length;
      fn.push(code);
      return f;
    }
    case 'array': {
      const type = generate(schema.items, fn);
      return '(function(v){' +
        'var i,j="[",l=v.length;' +
        'for(i=0;i<l;i++){' +
          'if(i>0)j+=",";' +
          'j+=' + type + "(v[i])" +
        '}' +
        'return j+"]"})';
    }
    case 'string':
    case 'json': {
      return 'f0';
    }
    default: {
      return '';
    }
  }
};

export const createSerializer = (schema: TypeSome): (json: unknown) => string => {
  const fn: string[] = [
    'JSON.stringify', // f0
  ];
  let code = generate(schema, fn);
  let header = '';
  for (let i = 0; i < fn.length; i++)
    header += `var f${i}=${fn[i]};\n`;
  code = header + 'return function(val){return ""+(' + code + '(val))}'
  // console.log(code);
  return eval('(function(){' + code + '})()');
};
