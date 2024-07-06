import { createClient, SanityClient } from 'next-sanity';

import { apiVersion, dataset, projectId, useCdn } from '../env';
import { allPaitingsQuery } from '@/sanity/lib/queries';

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
