import { createClient, SanityClient } from 'next-sanity';

import { apiVersion, dataset, projectId, useCdn } from '../env';
import { Product } from '@/types/Product';
import {
  allPaitingsQuery,
  siteSettingsQuery,
  allProductsQuery,
  productByIdQuery,
} from '@/sanity/lib/queries';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
});

export async function getPaintings(client: SanityClient) {
  return (await client.fetch(allPaitingsQuery)) || [];
}

export async function getSiteSettings(client: SanityClient) {
  return await client.fetch(siteSettingsQuery);
}

export async function getAllProducts(client: SanityClient): Promise<Product[]> {
  return await client.fetch(allProductsQuery);
}

export async function getProduct(
  client: SanityClient,
  id: string
): Promise<Product | null> {
  return await client.fetch(productByIdQuery, { id });
}

export function getClient(): SanityClient {
  return client;
}
