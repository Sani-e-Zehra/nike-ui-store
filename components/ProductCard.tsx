import client from "../lib/sanityClient";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export default function ProductCard({ product }) {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <img
        src={builder.image(product.image).width(300).url()}
        alt={product.name}
        className="w-full h-auto"
      />
      <h3 className="font-bold mt-2">{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}
