import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

/**
 * Used to fetch data in Server Components, it has built in support for handling Draft Mode and perspectives.
 * When using the "published" perspective then time-based revalidation is used, set to match the time-to-live on Sanity's API CDN (60 seconds)
 * and will also fetch from the CDN.
 * When using the "previewDrafts" perspective then the data is fetched from the live API and isn't cached, it will also fetch draft content that isn't published yet.
 * 
 * https://www.sanity.io/docs/stega
 * NOTICE(javayhu) be careful if enable stega, the string returned from sanity may contains invisible characters!!!
 * TODO(javayhu) maybe change perspective here?
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  // perspective = (process.env.NODE_ENV === "development" || draftMode().isEnabled) ? "previewDrafts" : "published",
  perspective = "published",
  useCache = true,
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  useCache?: boolean;
}) {
  // if (perspective === "previewDrafts") {
  //   return client.fetch<QueryResponse>(query, params, {
  //     perspective: "previewDrafts",
  //     // The token is required to fetch draft content
  //     token,
  //     // The `previewDrafts` perspective isn't available on the API CDN
  //     useCdn: false,
  //     // And we can't cache the responses as it would slow down the live preview experience
  //     next: { revalidate: 0 },
  //   });
  // }
  console.log('sanityFetch, perspective:', perspective, 'useCache:', useCache);
  return client.fetch<QueryResponse>(query, params, {
    perspective: "published",
    // The `published` perspective is available on the API CDN
    useCdn: useCache, // default is true, but sometimes I want to disable it
    // When using the `published` perspective we use time-based revalidation to match the time-to-live on Sanity's API CDN (60 seconds)
    next: { revalidate: useCache ? 60 : 0 },
  });
}
