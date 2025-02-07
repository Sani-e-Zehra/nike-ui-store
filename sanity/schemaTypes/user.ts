import { defineType } from 'sanity';

export const user = defineType({
  name: 'user',
  type: 'document',
  title: 'User',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'User Name',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email Address',
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: 'address',
      type: 'text',
      title: 'Shipping Address',
    },
    {
      name: 'orders',
      type: 'array',
      title: 'Order History',
      of: [{ type: 'reference', to: [{ type: 'order' }] }],
    },
  ],
});
