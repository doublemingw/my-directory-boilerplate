import { notFound } from "next/navigation";

import ProductSingleClient from "@/components/product-single-client";
import { COMMON_PARAMS } from "@/lib/constants";
import { ProductQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { productQuery } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { urlForImageWithSize } from "@/sanity/lib/utils";
import { AllSiteConfigs } from "@/config/site";

interface ProductPageProps {
    params: {
        lang: string;
        product: string;
    }
}

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const { lang, product } = params;
    console.log('generateMetadata, lang:', lang, ', product:', product);
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('generateMetadata, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const productQueryResult = await sanityFetch<ProductQueryResult>({
        query: productQuery,
        params: {
            ...queryParams,
            slug: product,
        },
    });
    // console.log('ProductPage, productQueryResult:', productQueryResult);
    if (!productQueryResult) {
        return {};
    }

    const siteConfig = AllSiteConfigs[lang];
    const currentUrl = `${siteConfig.url}/${lang}/product/${productQueryResult.slug}`;
    const canonicalUrl = `${siteConfig.url}/en/product/${productQueryResult.slug}`;
    const ogImage = urlForImageWithSize(productQueryResult.coverImage, 960, 540);

    return {
        title: productQueryResult.name,
        description: productQueryResult.desc,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "website",
            url: currentUrl,
            title: productQueryResult.name,
            images: [ogImage],
            description: productQueryResult.desc,
        },
        twitter: {
            site: currentUrl,
            card: "summary_large_image",
            title: productQueryResult.name,
            description: productQueryResult.desc,
            images: [ogImage],
        },
    }
}

// https://nextjs.org/learn/dashboard-app/streaming
// use loading.tsx instead of suspense here
export default async function ProductPage({ params }: ProductPageProps) {
    const { lang, product } = params;
    console.log('ProductPage, lang:', lang, ', product', product);
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('ProductPage, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const productQueryResult = await sanityFetch<ProductQueryResult>({
        query: productQuery,
        params: {
            ...queryParams,
            slug: product,
        },
    });
    // console.log('ProductPage, productQueryResult:', productQueryResult);
    if (!productQueryResult) {
        return notFound();
    }

    return (
        <ProductSingleClient lang={lang} product={productQueryResult} />
    )
}