import { groq } from "next-sanity";

/**
 * products
 */
const tagFields = /* groq */ `
  ...,
  "slug": slug.current,
`;

const categoryFields = /* groq */ `
  ...,
  "slug": slug.current,
  "name": coalesce(name[$lang], name[$defaultLocale]),
  group-> {
    ..., 
    "slug": slug.current,
    "name": coalesce(name[$lang], name[$defaultLocale]),
  },
`;

const groupFields = /* groq */ `
  ...,
  "slug": slug.current,
  "name": coalesce(name[$lang], name[$defaultLocale]),
  "categories": *[_type=='category' && references(^._id)] | order(order desc, _createdAt asc)
  { 
    ..., 
    "slug": slug.current,
    "name": coalesce(name[$lang], name[$defaultLocale]),
  }
`;

const guideFields = /* groq */ `
  ...,
  "slug": slug.current,
`;

const apptypeFields = /* groq */ `
  ...,
  "slug": slug.current,
  "name": coalesce(name[$lang], name[$defaultLocale]),  
`;

// for sitemap
export const productListQueryForSitemap = groq`*[_type == "product" && visible == true] | order(order desc, _createdAt asc) {
  _id,
  "slug": slug.current,
}`;

// for sitemap
export const categoryListQueryForSitemap = groq`*[_type == "category"] | order(order desc, _createdAt asc) {
  _id,  
  "slug": slug.current,
  group-> {
    _id,
    "slug": slug.current,
  },
}`;

// for sitemap
export const appListQueryForSitemap = groq`*[_type == "application" && status == "approved"] | order(order desc, _createdAt asc) {
  _id,  
  name,
}`;

// for sitemap
export const appTypeListQueryForSitemap = groq`*[_type == "appType"] | order(order desc, _createdAt asc) {
  _id,
  "slug": slug.current,
}`;

// for metadata
export const categoryQuery = groq`*[_type == "category" && slug.current == $slug] [0] {
  _id,
  "name": coalesce(name[$lang], name[$defaultLocale]),
}`;

// for metadata
export const appTypeQuery = groq`*[_type == "appType" && slug.current == $slug] [0] {
  _id,
  "name": coalesce(name[$lang], name[$defaultLocale]),
}`;

/**
 * 1、user queries
 * 2、_id is sanity id, id is database id
 */
const userFields = /* groq */ `
  ...
`;

const productFields = /* groq */ `
  ...,
  "slug": slug.current,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "desc": coalesce(desc[$lang], desc[$defaultLocale]),
  "date": coalesce(date, _createdAt),
  category-> {
    ${categoryFields}
  },
  tags[]-> {
    ${tagFields}
  },
  guides[]-> {
    ${guideFields}
  },
  submitter-> {
    ${userFields}
  },
`;

// this query is not used for now
// "name": coalesce(name[$lang], name[$defaultLocale]),
export const groupListQuery = groq`*[_type == "group"] | order(order desc, _createdAt asc) {
  ${groupFields}
}`;

export const groupQuery = groq`*[_type == "group" && slug.current == $slug] [0] {
  ${groupFields}
}`;

// "name": coalesce(name[$lang], name[$defaultLocale]), is working if convert the below to string in sanity.types.ts
// name: Array<{
//   _type: "localizedString";
//   en?: string;
//   zh?: string;
// }> | null;
export const groupListWithCategoryQuery = groq`*[_type=="group"] | order(order desc, _createdAt asc) {
  ${groupFields}
}`;

export const categoryListQuery = groq`*[_type == "category"] | order(order desc, _createdAt asc) {
  ${categoryFields}
}`;

export const tagListQuery = groq`*[_type == "tag"] | order(order desc, _createdAt asc) {
  ${tagFields}
}`;

export const categoryListByGroupQuery = groq`*[_type == "category" && references(*[_type == "group" && slug.current == $groupSlug]._id)] | order(order desc, _createdAt asc) {
  ${categoryFields}
}`;

export const productListByGroupQuery = groq`*[_type == "product" && visible == true && category._ref in (*[_type == "category" && group._ref in (*[_type == "group" && slug.current == $groupSlug]._id)]._id)]  | order(order desc, _createdAt asc) {
  ${productFields}
}`;

export const productListQuery = groq`*[_type == "product" && visible == true] | order(order desc, _createdAt asc) {
  ${productFields}
}`;

export const productListOfFeaturedQuery = groq`*[_type == "product" && visible == true && featured == true] | order(order desc, _createdAt asc) [0...$limit] {
  ${productFields}
}`;

export const productListByCategoryQuery = groq`*[_type == "product" && visible == true && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(order desc, _createdAt asc) {
  ${productFields}
}`;

export const productListOfRecentQuery = groq`*[_type == "product" && visible == true] | order(_createdAt desc) [0...$limit] {
  ${productFields}
}`;

export const productQuery = groq`*[_type == "product" && visible == true && slug.current == $slug] [0] {
  content,
  ${productFields}
}`;

/**
 * applications
 */
const applicationFields = /* groq */ `
  ...,
  types[]-> {
    ${apptypeFields}
  },
  user-> {
    ${userFields}
  },
`;

export const appQuery = groq`*[_type == "application" && name == $slug] [0] {
  ${applicationFields}
}`;

export const appTypeListQuery = groq`*[_type == "appType"] | order(order desc, _createdAt asc) {
  ${apptypeFields}
}`;

export const applicationListOfFeaturedQuery = groq`*[_type == "application" && status == "approved" && featured == true] | order(order desc, _createdAt asc) {
  ${applicationFields}
}`;

export const applicationListOfRecentQuery = groq`*[_type == "application" && status == "approved"] | order(_createdAt desc) [0...$limit] {
  ${applicationFields}
}`;

export const applicationListByCategoryQuery = groq`*[_type == "application" && status == "approved" && references(*[_type == "appType" && slug.current == $categorySlug]._id)] | order(order desc, _createdAt asc) {
  ${applicationFields}
}`;

export const applicationListByUserQuery = groq`*[_type == "application" && references(*[_type == "user" && id == $userid]._id)] | order(_createdAt asc) {
  ${applicationFields}
}`;

export const userQuery = groq`*[_type == "user" && id == $userId][0] {
  ${userFields}
}`;


/**
 * demo queries
 */
const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

export const moreStoriesQuery = groq`*[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
  ${postFields}
}`;

export const postQuery = groq`*[_type == "post" && slug.current == $slug] [0] {
  content,
  ${postFields}
}`;

export const settingsQuery = groq`*[_type == "settings"][0]`;

export const heroQuery = groq`*[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
  ${postFields}
}`;
