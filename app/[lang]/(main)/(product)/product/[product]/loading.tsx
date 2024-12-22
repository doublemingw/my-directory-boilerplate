import { Icons } from "@/components/shared/icons";

export default function Loading() {
    return (
        <div className="min-h-screen pb-16">
            <div className="container">
                <Icons.spinner className="mt-32 mx-auto size-6 animate-spin" />
            </div>
        </div>
    )
}