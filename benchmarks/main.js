const Benchmark = require('benchmark');
const {createSerializer} = require('../es6');

const suite = new Benchmark.Suite;

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

const schema = {
  type: 'object',
  properties: {
    id: {type: 'string_serialized'},
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
};

const serializer = createSerializer(schema);
 
suite
  .add('json-schema-serializer', function() {
    serializer(obj);
  })
  .add('JSON.stringify', function() {
    JSON.stringify(obj);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
