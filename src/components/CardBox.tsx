import type { ReactNode } from "react";

type Props = {
    name: string;
    onAdd: () => void;
    children?: ReactNode;
}

export function CardBox({ name, onAdd, children }: Props) {
    return <div className="bg-gray-100 w-100 h-200 flex-none border-2 p-2">
        <div className="pb-2">
            {name}
        </div>
        {children}
        <button className="cursor-pointer text-center w-full bg-gray-300 mt-3" type="button" onClick={onAdd}>+ add</button>
    </div>;
}