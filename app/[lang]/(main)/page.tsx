import { HeroLanding } from "@/components/sections/hero-landing-custom";
import { InfoLanding } from "@/components/sections/info-landing-custom";
import { Powered } from "@/components/sections/powered";
import { Testimonials } from "@/components/sections/testimonials";
import { infos } from "@/config/landing-custom";
import { redirect } from "next/navigation";

export default async function IndexPage({ params }: { params: { lang: string }; }) {
  console.log('IndexPage, params:', params);
  const { lang } = params;
  
  // redirect to products page
  return redirect(`/${lang}/group/new`);

  // return (
  //   <>
  //     <HeroLanding lang={lang} />
  //     {/* <PreviewLanding /> */}
  //     <Powered />
  //     {/* <BentoGrid /> */}
  //     <InfoLanding data={infos[0]} reverse={true} />
  //     <InfoLanding data={infos[1]} />
  //     {/* <Features /> */}
  //     <Testimonials />
  //   </>
  // );
}
