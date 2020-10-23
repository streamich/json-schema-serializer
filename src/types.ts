export interface TypeObject {
  type: 'object';
  properties: Record<string, TypeSome>;
  optional?: string[];
}

export interface TypeArray {
  type: 'array';
  items: TypeSome;
}

export interface TypeString {
  type: 'string';
}

export interface TypeNumber {
  type: 'number';
}

export interface TypeBoolean {
  type: 'boolean';
}

export interface TypeNull {
  type: 'null';
}

export interface TypeJson {
  type: 'json';
}
export interface TypeRawJson {
  type: 'serialized_json';
}

export type TypeSome = TypeObject | TypeArray | TypeString | TypeNumber | TypeBoolean | TypeNull | TypeJson | TypeRawJson;
