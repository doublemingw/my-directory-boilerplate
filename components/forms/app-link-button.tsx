"use client";

import { useRouter } from "next/navigation";
import ShimmerButton from "../magicui/shimmer-button";

interface AppLinkButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    lang: string;
    link: string;
    children?: React.ReactNode;
}

export function AppLinkButton({ lang, link, children }: AppLinkButtonProps) {
    const router = useRouter();
    const handleClick = async (e) => {
        router.push(`${link}`);
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
