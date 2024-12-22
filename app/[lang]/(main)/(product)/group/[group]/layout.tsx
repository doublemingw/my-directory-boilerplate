import CategoryListClient from "@/components/category-list-client";
import { COMMON_PARAMS } from "@/lib/constants";
import { GroupQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { groupQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

interface ProductGroupLayoutProps {
    params: { lang: string; group: string };
    children: React.ReactNode;
}

export default async function ProductGroupLayout({ params, children }: ProductGroupLayoutProps) {
    console.log('ProductGroupLayout, params:', params); // params: { lang: 'en', group: 'xxx' }
    const { lang, group } = params;
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('ProductGroupLayout, language:', lang); // language: en
    // console.log('ProductGroupLayout, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const groupQueryResult = await sanityFetch<GroupQueryResult>({
        query: groupQuery,
        params: {
            ...queryParams,
            slug: group,
        },
    });

    // console.log('ProductGroupLayout, groupQueryResult:', groupQueryResult);
    if (!groupQueryResult) {
        console.error('ProductGroupLayout, group not found:', group);
        return notFound();
    }

    return (
        <div className="grid space-y-8">
            {/* Category List */}
            <CategoryListClient lang={lang} group={groupQueryResult} />

            {/* Product Grid */}
            {children}
        </div>
    );
}