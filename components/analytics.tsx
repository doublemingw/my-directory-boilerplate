import GoogleAnalytics from "./google-analytics";
// import MicrosoftAnalytics from "./clarity-analytics";
import { OpenPanelComponent } from '@openpanel/nextjs';

export function Analytics() {
    if (process.env.NODE_ENV !== "production") {
        return null;
    }

    return (
        <>

            {/* https://docs.openpanel.dev/docs/sdks/nextjs#options */}
            <OpenPanelComponent
                clientId="553f968f-8f6b-470e-9146-612e6909eaf3"
                trackScreenViews={true}
                trackAttributes={true}
                trackOutgoingLinks={true}
            />

            {/* vercel analytics */}
            {/* <Analytics /> */}
            {/* <SpeedInsights /> */}

            {/* google analytics */}
            {/* <GoogleAnalytics /> */}

            {/* clarity analytics */}
            {/* 20240603, I can confirm that this is working but it slows down the site */}
            {/* <MicrosoftAnalytics /> */}

            {/* umami analytics, CORS policy blocks */}
            {/* <script defer src="https://cloud.umami.is/script.js" data-website-id=""></script> */}
        </>
    )
}