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

export interface TypeStringEscaped {
  type: 'string_escaped';
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
export interface TypeJsonSerialized {
  type: 'json_serialized';
}

export interface TypeAny {
  type: 'any';
}

export type TypeSome = TypeObject | TypeArray | TypeString | TypeStringEscaped | TypeNumber | TypeBoolean | TypeNull | TypeJson | TypeJsonSerialized | TypeAny;
