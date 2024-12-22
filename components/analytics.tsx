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
            <GoogleAnalytics />

            {/* clarity analytics */}
            {/* 20240603, I can confirm that this is working but it slows down the site */}
            {/* <MicrosoftAnalytics /> */}

            {/* umami analytics, CORS policy blocks */}
            {/* <script defer src="https://cloud.umami.is/script.js" data-website-id="a8eb270e-f183-4500-8a43-a8ac5707c3ba"></script> */}

            {/* umami analytics, self hosted on vercel */}
            <script defer src="https://umami.indiehackers.site/script.js" data-website-id="83df2afd-33f2-4bc1-870e-e5660e3c7cf8"></script>
        </>
    )
}