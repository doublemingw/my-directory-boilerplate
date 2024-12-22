import AppTypeList from "@/components/apptype-list";
import { FeaturePageHeader } from "@/components/feature-page-header";
import { SubmitApplicationButton } from "@/components/forms/submit-application-button";
import { AllApplicationConfigs } from "@/config/application";

interface AppListLayoutProps {
    children: React.ReactNode;
    params: { lang: string };
}

export default async function AppListLayout({ params, children }: AppListLayoutProps) {
    console.log('AppListLayout, params:', params); // params: { lang: 'en', type: 'new' }
    const { lang } = params;
    // const queryParams = { ...COMMON_PARAMS, lang };
    // console.log('AppListLayout, language:', lang); // language: en
    // console.log('AppListLayout, queryParams:', queryParams); // queryParams: { defaultLocale: 'en', lang: 'en' }

    const applicationConfig = AllApplicationConfigs[lang];

    return (
        <div className="min-h-screen pb-16">
            {/* Page Header */}
            <div className="bg-linear py-10">
                <FeaturePageHeader className="container"
                    heading={applicationConfig.title}
                    text={applicationConfig.subtitle}>
                    <SubmitApplicationButton lang={lang}>
                        <span>{applicationConfig.submitButton}</span>
                    </SubmitApplicationButton>
                </FeaturePageHeader>
            </div>

            <div className="container mt-8 flex flex-col gap-8">
                {/* AppType List */}
                <AppTypeList lang={lang} />

                {/* Application Grid */}
                {children}
            </div>
        </div>
    );
}