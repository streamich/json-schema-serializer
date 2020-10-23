import {TypeSome} from './types';

const generate = (schema: TypeSome): string => {
  switch (schema.type) {
    case 'object': {
      const optional = schema.optional || [];
      let code = '(function(v){var c=0,j="{";';
      const keys = Object.keys(schema.properties);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const isOptional = optional.indexOf(key) > -1;
        if (isOptional) {
          code += /* js */ `if (v[${JSON.stringify(key)}] !== undefined) j+=(c>0?',':'')+${JSON.stringify(JSON.stringify(key))}+":"+${generate(schema.properties[key])}(v[${JSON.stringify(key)}]);c++;`;
        } else {
          code += /* js */ `j+=(c>0?',':'')+${JSON.stringify(JSON.stringify(key))}+":"+${generate(schema.properties[key])}(v[${JSON.stringify(key)}]);c++;`;
        }
      }
      code += /* js */ `return j+'}'})`;
      return code;
    }
    case 'array': {
      const type = generate(schema.items);
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
      return 'JSON.stringify';
    }
    default: {
      return '';
    }
  }
};

export const createSerializer = (schema: TypeSome): (json: unknown) => string => {
  const code = generate(schema);
  // console.log(code);
  return eval(code);
};
