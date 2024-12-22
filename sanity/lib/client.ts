import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { token } from "./token";

// when write data to sanity, token with write permission is required!
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: token,
  perspective: "published",
});
