import { CardBox } from "@/components/CardBox";
import { TaskCard } from "@/components/TaskCard";

import type { CardArea } from "../types/types";

export default function Home() {
  const data: CardArea[] = [
    {
      id: 0,
      name: "area1",
      tasks: [
        { id: 0, name: "taskname" },
        { id: 1, name: "taskname2" },
      ],
    },
    { id: 1, name: "area2", tasks: [{ id: 0, name: "taskname3" }] },
  ];
  return (
    <div className="p-5 flex gap-5 overflow-x-auto w-full">
      {data.map((area) => {
        return (
          <CardBox name={area.name} key={area.id}>
            {area.tasks.map((task) => {
              return <TaskCard key={task.id} />;
            })}
          </CardBox>
        );
      })}
    </div>
  );
}
