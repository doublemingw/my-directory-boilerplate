import { COMMON_PARAMS } from "@/lib/constants";
import { GroupListWithCategoryQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { groupListWithCategoryQuery } from "@/sanity/lib/queries";
import { redirect } from "next/navigation";

// NOTICE(javayhu) can be deleted
export default async function CategoryIndexPage({ params }: { params: { lang: string, group: string }; }) {
    console.log('CategoryIndexPage, params:', params); // params: { lang: 'en' }
    const { lang, group } = params;
    const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('CategoryIndexPage, language:', lang); // language: en
    // console.log('CategoryIndexPage, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const groupListWithCategoryQueryResult = await sanityFetch<GroupListWithCategoryQueryResult>({
        query: groupListWithCategoryQuery,
        params: queryParams,
    });
    
    const groupItem = groupListWithCategoryQueryResult.find((item) => item.slug === group);
    if (!groupItem || groupItem.categories.length === 0) {
        console.log('CategoryIndexPage, groupItem is undefined, redirect to new');
        return redirect(`/${lang}/group/new`);
    }
    
    return redirect(`/${lang}/group/${group}/category/${groupItem.categories[0].slug}`);
}