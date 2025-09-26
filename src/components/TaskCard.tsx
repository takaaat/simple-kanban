type Props = {
    name: string;
}
export function TaskCard({ name }: Props) {
    return <div className="bg-white w-full text-lg border-2 p-2 mb-2 cursor-pointer">{name}</div>;
}