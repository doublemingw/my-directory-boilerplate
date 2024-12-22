import ProductGridCient from "@/components/product-grid-client";
import { AllSiteConfigs } from "@/config/site";
import { COMMON_PARAMS } from "@/lib/constants";
import { CategoryQueryResult, ProductListByCategoryQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryQuery, productListByCategoryQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";

interface CategoryPageProps {
    params: {
        lang: string;
        group: string;
        category: string;
    }
}

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { lang, group, category } = params;
    // console.log('generateMetadata, lang:', lang, ', group:', group, ', category:', category);
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('generateMetadata, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const categoryQueryResult = await sanityFetch<CategoryQueryResult>({
        query: categoryQuery,
        params: {
            ...queryParams,
            slug: category,
        },
    });
    console.log('generateMetadata, categoryQueryResult:', categoryQueryResult);
    if (!categoryQueryResult) {
        return {};
    }

    const siteConfig = AllSiteConfigs[lang];
    const currentUrl = `${siteConfig.url}/${lang}/group/${group}/category/${category}`;
    const canonicalUrl = `${siteConfig.url}/en/group/${group}/category/${category}`;

    return {
        title: categoryQueryResult.name,
        description: siteConfig.description,
        alternates: {
            canonical: canonicalUrl,
        },
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    console.log('CategoryPage, params:', params); // params: { lang: 'en' }
    const { lang, group, category } = params;
    console.log('CategoryPage, group:', group, ', category:', category);
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('CategoryPage, language:', lang); // language: en
    // console.log('CategoryPage, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const productListQueryResult = await sanityFetch<ProductListByCategoryQueryResult>({
        query: productListByCategoryQuery,
        params: {
            ...queryParams,
            categorySlug: category,
        },
    });

    return (
        <ProductGridCient lang={lang} itemList={productListQueryResult} />
    );
}