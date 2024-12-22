import ApplicationGridCient from "@/components/app-grid-client";
import { AllSiteConfigs } from "@/config/site";
import { COMMON_PARAMS } from "@/lib/constants";
import { ApplicationListByCategoryQueryResult, ApplicationListOfFeaturedQueryResult, ApplicationListOfRecentQueryResult, AppTypeQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { applicationListByCategoryQuery, applicationListOfFeaturedQuery, applicationListOfRecentQuery, appTypeQuery } from "@/sanity/lib/queries";
import { urlForImageWithSize } from "@/sanity/lib/utils";
import { Metadata } from "next";

interface AppTypePageProps {
    params: {
        lang: string;
        type: string;
    }
}

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({
    params,
}: AppTypePageProps): Promise<Metadata> {
    const { lang, type } = params;
    console.log('generateMetadata, lang:', lang, ', type:', type);
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('generateMetadata, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const appTypeQueryResult = await sanityFetch<AppTypeQueryResult>({
        query: appTypeQuery,
        params: {
            ...queryParams,
            slug: type,
        },
    });
    console.log('generateMetadata, appTypeQueryResult:', appTypeQueryResult);
    if (!appTypeQueryResult) {
        return {};
    }

    const siteConfig = AllSiteConfigs[lang];
    const currentUrl = `${siteConfig.url}/${lang}/apptype/${type}`;
    const canonicalUrl = `${siteConfig.url}/en/apptype/${type}`;

    return {
        title: appTypeQueryResult.name,
        description: siteConfig.description,
        alternates: {
            canonical: currentUrl,
        },
    }
}

export default async function AppListPage({ params }: AppTypePageProps) {
    console.log('AppListPage, params:', params); // params: { lang: 'en', type: 'new' }

    const { lang, type } = params;
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('AppListPage, language:', lang); // language: en
    // console.log('AppListPage, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const category = type;
    console.log('AppListPage, category:', category);

    let applicationListQueryResult: ApplicationListByCategoryQueryResult | ApplicationListOfFeaturedQueryResult | ApplicationListOfRecentQueryResult;
    if (category === 'featured') {
        applicationListQueryResult = await sanityFetch<ApplicationListOfFeaturedQueryResult>({
            query: applicationListOfFeaturedQuery,
            params: {
                ...queryParams,
            }
        });
    } else if (category === 'new') { // TODO(javayhu) may not be limited
        applicationListQueryResult = await sanityFetch<ApplicationListOfRecentQueryResult>({
            query: applicationListOfRecentQuery,
            params: {
                ...queryParams,
                limit: 24,
            }
        });
    } else {
        applicationListQueryResult = await sanityFetch<ApplicationListByCategoryQueryResult>({
            query: applicationListByCategoryQuery,
            params: {
                ...queryParams,
                categorySlug: category 
            },
        });
    }

    return (
        <ApplicationGridCient lang={lang} itemList={applicationListQueryResult}
            category={category} />
    );
}