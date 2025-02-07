import { defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Product Name',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
    },
    {
      name: 'price',
      type: 'number',
      title: 'Price',
      validation: (Rule) => Rule.min(0).required(),
    },
    {
      name: 'stock',
      type: 'number',
      title: 'Stock Quantity',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'image',
      type: 'image',
      title: 'Product Image',
      options: { hotspot: true },
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Running Shoes', value: 'running' },
          { title: 'Basketball Shoes', value: 'basketball' },
          { title: 'Lifestyle Shoes', value: 'lifestyle' },
        ],
      },
    },
  ],
});
