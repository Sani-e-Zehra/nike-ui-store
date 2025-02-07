import { SchemaTypeDefinition } from 'sanity';
import { product } from './product';
import { order } from './order';
import { user } from './user';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, order, user],
};
