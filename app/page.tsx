'use client';

import { sanityClient, urlFor } from '../lib/sanityClient';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const fetchFeaturedProducts = async () => {
  const query = `*[_type == "product"][0..5] {
    _id,
    name,
    description,
    price,
    "imageUrl": image.asset->url
  }`;
  return await sanityClient.fetch(query);
};

export default function HomePage() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  // Fetch products on client side (since this is a client component)
  useEffect(() => {
    fetchFeaturedProducts().then((data) => setFeaturedProducts(data));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">Step into Style with Nike</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Explore our premium collection of Nike shoes designed for athletes and trendsetters alike.
          </p>
          <a href="/products" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 text-lg rounded-lg hover:bg-blue-700">
            Shop Now
          </a>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <div key={product._id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={urlFor(product.imageUrl).url()} alt={product.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description.slice(0, 50)}...</p>
                  <p className="font-bold text-blue-600 mt-2">${product.price}</p>
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
                    className="block mt-4 text-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 w-full"
                  >
                    Add to Cart
                  </button>
                  <a href={`/products/${product._id}`} className="block mt-2 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
