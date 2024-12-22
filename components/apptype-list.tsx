import { AppTypeListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { appTypeListQuery } from "@/sanity/lib/queries";
import { Suspense } from "react";
import AppTypeListClient from "./apptype-list-client";
import AppTypeListLoading from "./apptype-list-loading";
import { COMMON_PARAMS } from "@/lib/constants";

export default function AppTypeList({ lang }: { lang: string }) {
    return (
        <Suspense fallback={<AppTypeListLoading />}>
            <AppTypeListRSC lang={lang} />
        </Suspense>
    );
}

async function AppTypeListRSC({ lang }: { lang: string }) {
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('CategoryPage, language:', lang); // language: en
    // console.log('CategoryPage, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }
    
    const [appTypeListQueryResult] = await Promise.all([
        sanityFetch<AppTypeListQueryResult>({
            query: appTypeListQuery,
            params: queryParams,
        }),
    ]);

    return (
        <AppTypeListClient lang={lang} categoryList={appTypeListQueryResult} />
    );
}
