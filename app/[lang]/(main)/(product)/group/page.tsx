import { redirect } from "next/navigation";

// NOTICE(javayhu) can be deleted
export default async function GroupIndexPage({ params }: { params: { lang: string }; }) {
    console.log('GroupIndexPage, params:', params); // params: { lang: 'en' }
    const { lang } = params;
    return redirect(`/${lang}/group/new`);
}