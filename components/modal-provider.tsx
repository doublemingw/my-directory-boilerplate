"use client";

import { SignInModal } from "@/components/layout/sign-in-modal";
import { useMounted } from "@/hooks/use-mounted";

export const ModalProvider = ({ lang }: { lang: string }) => {
  const mounted = useMounted();
  if (!mounted) {
    console.log("ModalProvider not mounted");
    return null;
  }

  return (
    <>
      <SignInModal lang={lang} />
      {/* <SubmitAppModal /> */}
      {/* add your own modals here... */}
    </>
  );
};