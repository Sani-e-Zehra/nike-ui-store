'use client';

import { useState, useEffect } from 'react';
import { sanityClient } from '../../lib/sanityClient';
import { urlFor } from '../../lib/sanityClient';

const fetchProducts = async () => {
  const query = `*[_type == "product"] {
    _id,
    name,
    description,
    price,
    stock,
    category,
    "imageUrl": image.asset->url
  }`;
  return await sanityClient.fetch(query);
};

const fetchUsers = async () => {
  const query = `*[_type == "user"] {
    _id,
    name,
    email,
    address
  }`;
  return await sanityClient.fetch(query);
};

const fetchOrders = async () => {
  const query = `*[_type == "order"] {
    _id,
    user->{
      name,
      email
    },
    items,
    totalPrice,
    status
  }`;
  return await sanityClient.fetch(query);
};

export default function AdminPage() {
  const [tab, setTab] = useState<'products' | 'users' | 'orders'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (tab === 'products') {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } else if (tab === 'users') {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } else if (tab === 'orders') {
        const ordersData = await fetchOrders();
        setOrders(ordersData);
      }
    };

    fetchData();
  }, [tab]);

  const handleAddOrEditProduct = async (product: any) => {
    if (product._id) {
      // Update existing product
      await sanityClient.patch(product._id).set(product).commit();
    } else {
      // Add new product
      await sanityClient.create({
        _type: 'product',
        ...product,
      });
    }

    setIsEditing(false);
    setSelectedProduct(null);
    const updatedProducts = await fetchProducts();
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = async (id: string) => {
    await sanityClient.delete(id);
    const updatedProducts = await fetchProducts();
    setProducts(updatedProducts);
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await sanityClient.patch(id).set({ status }).commit();
    const updatedOrders = await fetchOrders();
    setOrders(updatedOrders);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 rounded-lg ${
            tab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-lg ${
            tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 rounded-lg ${
            tab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Manage Orders
        </button>
      </div>

      {tab === 'products' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <button
            onClick={() => {
              setIsEditing(true);
              setSelectedProduct(null); // Open blank form
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
          >
            Add New Product
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border p-4 rounded-lg">
                <img
                  src={urlFor(product.imageUrl).url()}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="font-bold">${product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsEditing(true);
                  }}
                  className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 ml-2"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {selectedProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const product = Object.fromEntries(formData.entries());
                handleAddOrEditProduct({
                  ...product,
                  _id: selectedProduct?._id || undefined,
                });
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedProduct?.name || ''}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedProduct?.description || ''}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={selectedProduct?.price || ''}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Stock</label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={selectedProduct?.stock || ''}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg mb-4">
              <h3 className="text-lg font-bold">
                Order by: {order.user.name} ({order.user.email})
              </h3>
              <p className="text-gray-600">Total: ${order.totalPrice}</p>
              <p className="text-gray-600">Status: {order.status}</p>
              <button
                onClick={() =>
                  handleUpdateOrderStatus(order._id, 'Completed')
                }
                className="mt-2 bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
              >
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
