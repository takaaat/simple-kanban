import type { ReactNode } from "react";

type Props = {
    name: string;
    children?: ReactNode;
}

export function CardBox({ name, children }: Props) {
    return <div className="bg-gray-100 w-100 h-200 flex-none border-2 p-2">
        {name}
        {children}
    </div>;
}