'use client';

import { useEffect, useState } from 'react';
import { sanityClient, urlFor } from '../../../lib/sanityClient';
import { useCart } from '../../../context/CartContext';

// Fetch product details by ID
const fetchProductById = async (id: string) => {
  const query = `*[_type == "product" && _id == $id][0] {
    _id,
    name,
    description,
    price,
    stock,
    category,
    "imageUrl": image.asset->url
  }`;
  return await sanityClient.fetch(query, { id });
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetchProductById(params.id).then((data) => setProduct(data));
  }, [params.id]);

  if (!product) {
    return <div className="p-8 text-center text-gray-600">Product not found!</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <img
        src={urlFor(product.imageUrl).url()}
        alt={product.name}
        className="w-full h-64 object-cover mt-4 rounded-lg"
      />
      <p className="mt-4 text-gray-600">{product.description}</p>
      <p className="mt-4 font-bold text-blue-600">Price: ${product.price}</p>
      
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
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
