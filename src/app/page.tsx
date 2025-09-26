'use client';

import { useState } from "react";
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
 
  const [kanban, setKanban] = useState<CardArea[]>(data);

  function addTask(area: CardArea, name: string) {
    setKanban(kanban.map((currentArea) => {
      if (currentArea.id === area.id) {
        return {...currentArea, tasks: [...currentArea.tasks, {id: currentArea.tasks.length, name: name}]};
      }
      return currentArea;
    }));
  }

  return (
    <div className="p-5 flex gap-5 overflow-x-auto w-full">
      {kanban.map((area) => {
        return (
          <CardBox name={area.name} key={area.id} onAdd={() => addTask(area, "aaa")}>
            {area.tasks.map((task) => {
              return <TaskCard key={task.id} name={task.name} />;
            })}
          </CardBox>
        );
      })}
    </div>
  );
}
