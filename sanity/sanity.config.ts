import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision'; 
import { schema } from './schemaTypes'; 

export default defineConfig({
  name: 'default',
  title: 'Nike UI Store',

  projectId: '0tcsjagk',  
  dataset: 'production',         

  plugins: [deskTool(), visionTool], 
  schema: schema,                      
});
