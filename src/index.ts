import {TypeSome} from './types';

const generate = (schema: TypeSome, fn: string[] = []): string => {
  switch (schema.type) {
    case 'object': {
      let code = '(function(v){return "';
      const keys = Object.keys(schema.properties);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        code += /* js */ `${i > 0 ? '+",' : '{'}${JSON.stringify(JSON.stringify(key)).slice(1,-1)}:"+${generate(schema.properties[key], fn)}(v[${JSON.stringify(key)}])`;
      }
      code += '+"}"})';
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
    case 'string_escaped': {
      return 'f1';
    }
    case 'string': {
      return 'f2';
    }
    case 'json':
    case 'any': {
      return 'f0';
    }
    default: {
      return '';
    }
  }
};

function asStringSmall (str: string) {
  var result = ''
  var last = 0
  var found = false
  var surrogateFound = false
  var l = str.length
  var point = 255
  for (var i = 0; i < l && point >= 32; i++) {
    point = str.charCodeAt(i)
    if (point >= 0xD800 && point <= 0xDFFF) {
      // The current character is a surrogate.
      surrogateFound = true
    }
    if (point === 34 || point === 92) {
      result += str.slice(last, i) + '\\'
      last = i
      found = true
    }
  }

  if (!found) {
    result = str
  } else {
    result += str.slice(last)
  }
  return ((point < 32) || (surrogateFound === true)) ? JSON.stringify(str) : '"' + result + '"'
}

function asString (str: string) {
  if (str.length < 42) {
    return asStringSmall(str)
  } else {
    return JSON.stringify(str)
  }
}

export const createSerializer = (schema: TypeSome): (json: unknown) => string => {
  const fn: string[] = [
    'JSON.stringify', // f0
    'function(s){return \'"\'+s+\'"\'}', // f1
    asString.toString(), // f2
  ];
  let code = generate(schema, fn);
  let header = '';
  for (let i = 0; i < fn.length; i++)
    header += `var f${i}=${fn[i]};\n`;
  code = header + 'return function(val){return ""+(' + code + '(val))}'
  code = '(function(){' + code + '})()';
  // console.log(code);
  return eval(code);
};
