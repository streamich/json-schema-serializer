# json-schema-serializer

Plain JS object to JSON serializer give a predefined rigid schema.

See `/benchmarks` folder for docs.

## Benchmarks

```
node benchmarks/block.js 
json-schema-serializer x 9,142,251 ops/sec ±0.96% (91 runs sampled)
json-schema-serializer (2) x 892,604 ops/sec ±0.53% (92 runs sampled)
JSON.stringify x 531,140 ops/sec ±0.76% (92 runs sampled)
Fastest is json-schema-serializer
```

## License

[MIT © Vadim Dalecky](LICENSE).
