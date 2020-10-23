import {createSerializer} from '..';
import { TypeSome } from '../types';

test('can serialize a string', () => {
  const serialize = createSerializer({type: 'string'});
  expect(serialize('')).toBe('""');
  expect(serialize('abc')).toBe('"abc"');
  expect(serialize('👍')).toBe('"👍"');
});

test('can serialize a number', () => {
  const serialize = createSerializer({type: 'number'});
  expect(serialize(123)).toBe('123');
  expect(serialize(0)).toBe('0');
  expect(serialize(1.2)).toBe('1.2');
});

test('can serialize a boolean', () => {
  const serialize = createSerializer({type: 'boolean'});
  expect(serialize(true)).toBe('true');
  expect(serialize(false)).toBe('false');
});

test('can serialize a null', () => {
  const serialize = createSerializer({type: 'boolean'});
  expect(serialize(null)).toBe('null');
});

test('can serialize a array of numbers', () => {
  const serialize = createSerializer({type: 'array', items: {type: 'number'}});
  expect(serialize([1, 2, 3])).toBe('[1,2,3]');
});

test('can serialize simple object', () => {
  const schema: TypeSome = {
    type: 'object',
    properties: {
      id: {type: 'string'},
      version: {type: 'number'},
      deleted: {type: 'boolean'},
      avatar: {type: 'null'},
    },
  };
  const serialize = createSerializer(schema);
  const result = serialize({id: '123', version: 123, deleted: false, avatar: null});
  expect(JSON.parse(result)).toEqual({id: '123', version: 123, deleted: false, avatar: null});
});

test('can serialize complex object', () => {
  const schema: TypeSome = {
    type: 'object',
    properties: {
      id: {type: 'string'},
      version: {type: 'number'},
      deleted: {type: 'boolean'},
      avatar: {type: 'null'},
      user: {
        type: 'object',
        properties: {
          firstName: {type: 'string'},
          lastName: {type: 'string'},
        },
      },
      operations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            op: {type: 'string'},
            path: {type: 'string'},
            value: {type: 'json'},
          }
        },
      },
    },
    optional: ['avatar', 'operations'],
  };
  const obj = {
    id: 'xxxxxxxxxx',
    version: 123,
    deleted: false,
    avatar: null,
    user: {
      firstName: 'Vadim',
      lastName: 'Dalecky',
    },
    operations: [
      {op: 'add', path: '/foo', value: 123},
    ],
  };
  const serialize = createSerializer(schema);
  const result = serialize(obj);
  // console.log(result);
  expect(JSON.parse(result)).toEqual(obj);
});

