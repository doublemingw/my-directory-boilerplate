import Image from "next/image";

// change Image to Icons, for better experience
export function Logo() {
    {/* <Icons.spinner /> 如果是 logo.svg，那么 size-6 差不多是 width={24} height={24} */}
    // return (
    //     <Icons.logo className="size-8" />
    // )
    return (
        <Image
            src="/logo.png"
            alt="Logo"
            title="Logo"
            width={96}
            height={96}
            className="size-8 rounded-md"
        />
    )
}
