import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configure the client
export const sanityClient = createClient({
  projectId: '0tcsjagk', // Replace with your actual Project ID
  dataset: 'production',        // Replace with your dataset name
  apiVersion: '2023-01-01',     // Use the latest API version
  useCdn: false,                // Disable CDN for real-time data
});

// Configure image URL builder
const builder = imageUrlBuilder(sanityClient);
export const urlFor = (source: any) => builder.image(source);
