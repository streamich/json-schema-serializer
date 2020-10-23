const Benchmark = require('benchmark');
const {createSerializer} = require('../es6');

const suite = new Benchmark.Suite;

const doc = {
  "type": "articles",
  "id": "1",
  "attributes": {
    "title": "JSON:API paints my bikeshed!",
    "body": "The shortest article. Ever.",
    "created": "2015-05-22T14:56:29.000Z",
    "updated": "2015-05-22T14:56:28.000Z"
  },
  "relationships": {
    "author": {
      "data": {"id": "42", "type": "people"}
    }
  }
};

const obj1 = {
  col: 'xxxxxyyyyy',
  id: 'xxxxxyyyyy',
  v: 0,
  ts: 160000000000,
  doc: JSON.stringify(doc),
};

const obj2 = {
  col: 'xxxxxyyyyy',
  id: 'xxxxxyyyyy',
  v: 0,
  ts: 160000000000,
  doc: doc,
};

const schema = {
  type: 'object',
  properties: {
    col: {type: 'string_escaped'},
    id: {type: 'string_escaped'},
    v: {type: 'number'},
    ts: {type: 'number'},
    doc: {type: 'json_raw'},
  },
};

const schema2 = {
  type: 'object',
  properties: {
    col: {type: 'string'},
    id: {type: 'string'},
    v: {type: 'number'},
    ts: {type: 'number'},
    doc: {type: 'json'},
  },
};

const serializer = createSerializer(schema);
const serializer2 = createSerializer(schema2);
 
suite
  .add('json-schema-serializer', function() {
    serializer(obj1);
  })
  .add('json-schema-serializer (2)', function() {
    serializer2(obj1);
  })
  .add('JSON.stringify', function() {
    JSON.stringify(obj2);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
