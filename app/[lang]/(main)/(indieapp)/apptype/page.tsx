import { redirect } from "next/navigation";

export default async function AppIndexPage({ params }: { params: { lang: string }; }) {
    console.log('AppIndexPage, params:', params); // params: { lang: 'en' }
    const { lang } = params;
    return redirect(`/${lang}/apptype/new`);
}