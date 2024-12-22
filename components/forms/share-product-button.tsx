"use client";

import { useSigninModal } from "@/hooks/use-signin-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ShimmerButton from "../magicui/shimmer-button";

interface ShareProductButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    lang: string;
    children?: React.ReactNode;
}

export function ShareProductButton({ lang, children }: ShareProductButtonProps) {
    const signInModal = useSigninModal();
    const router = useRouter();
    const {data:session, status} = useSession();

    const handleClick = async (e) => {
        if (!session?.user) {
            signInModal.onOpen();
        } else {
            router.push(`/${lang}/dashboard/submit`);
        }
    }

    return (
        <ShimmerButton onClick={handleClick}
            className="h-10 py-2 px-4 shadow-sm text-primary-foreground dark:text-primary-foreground"
            background="#7C3AED"
            shimmerDuration="2s"
            shimmerSize="0.1em"
            shimmerColor="#ffffff">
            {children}
        </ShimmerButton>
    );
}
