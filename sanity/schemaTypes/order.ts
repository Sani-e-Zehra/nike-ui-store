import { defineType } from 'sanity';

export const order = defineType({
  name: 'order',
  type: 'document',
  title: 'Order',
  fields: [
    {
      name: 'userId',
      type: 'string',
      title: 'User ID',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'products',
      type: 'array',
      title: 'Ordered Products',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    },
    {
      name: 'totalAmount',
      type: 'number',
      title: 'Total Amount',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'orderStatus',
      type: 'string',
      title: 'Order Status',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Order Created At',
      initialValue: () => new Date().toISOString(),
    },
  ],
});
