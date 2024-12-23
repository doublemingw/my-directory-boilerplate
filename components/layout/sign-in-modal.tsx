"use client";

import { useState } from "react";

import { Icons } from "@/components/shared/icons";
import { Logo } from "@/components/shared/logo";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { AllAuthConfigs } from "@/config/auth";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { DEFAULT_REDIRECT_HOME_URL } from "@/routes";
import { signIn } from "next-auth/react";

export const SignInModal = ({ lang }: { lang: string }) => {
  // console.log("SignInModal, lang:", lang);
  const authConfig = AllAuthConfigs[lang];

  const signInModal = useSigninModal();
  const [signInWithGithubClicked, setSignInWithGithubClicked] = useState(false);
  const [signInWithGoogleClicked, setSignInWithGoogleClicked] = useState(false);

  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <Logo />
          <h3 className="text-2xl font-bold">
            {authConfig.signin}
          </h3>
          <p className="text-sm text-gray-500">
            {authConfig.signinDesc}
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-muted/25 px-16 py-8 md:px-16">
          {/* callbackUrl is very important, if user login success, redirect to /dashboard */}
          <Button
            variant="default"
            className="rounded-full"
            disabled={signInWithGithubClicked || signInWithGoogleClicked}
            onClick={() => {
              console.log("SignInModal, signInWithGithubClicked");
              setSignInWithGithubClicked(true);
              signIn("github", {
                callbackUrl: `/${lang}${DEFAULT_REDIRECT_HOME_URL}`,
                redirect: true,
              }).then(() =>
                // TODO: fix this without setTimeOut(), modal closes too quickly. Idea: update value before redirect
                setTimeout(() => {
                  signInModal.onClose();
                }, 3000)
              );
            }}
          >
            {signInWithGithubClicked ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.github className="mr-2 size-4" />
            )}{" "}
            {authConfig.signinWithGitub}
          </Button>

          {/* <Button
            variant="default"
            className="rounded-full"
            disabled={signInWithGoogleClicked || signInWithGithubClicked}
            onClick={() => {
              console.log("SignInModal, signInWithGoogleClicked");
              setSignInWithGoogleClicked(true);
              signIn("google", {
                callbackUrl: `/${lang}${DEFAULT_REDIRECT_HOME_URL}`,
                redirect: true,
              }).then(() =>
                // TODO: fix this without setTimeOut(), modal closes too quickly. Idea: update value before redirect
                setTimeout(() => {
                  signInModal.onClose();
                }, 3000)
              );
            }}
          >
            {signInWithGoogleClicked ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 size-4" />
            )}{" "}
            {authConfig.signinWithGoogle}
          </Button> */}
        </div>
      </div>
    </Modal>
  );
};