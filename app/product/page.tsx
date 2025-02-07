'use client';

import { useEffect, useState } from 'react';
import { sanityClient, urlFor } from '../../lib/sanityClient';
import { useCart } from '../../context/CartContext';

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

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);

  // Fetch products on the client side
  useEffect(() => {
    fetchProducts().then((data) => setProducts(data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow-md">
            <img
              src={urlFor(product.imageUrl).url()}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
            <p className="text-gray-600">{product.description.slice(0, 50)}...</p>
            <p className="font-bold text-blue-600">${product.price}</p>
            <button
              onClick={() =>
                addToCart({
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  imageUrl: urlFor(product.imageUrl).url(),
                  quantity: 1,
                })
              }
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full"
            >
              Add to Cart
            </button>
            <a
              href={`/products/${product._id}`}
              className="block mt-2 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
