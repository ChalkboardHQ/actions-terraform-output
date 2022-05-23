export type PropertyType = 'string' | 'number' | 'bool' | 'list' | 'map' | 'null'

export interface Property {
  sensitive: boolean;
  type: PropertyType;
  value: unknown;
}