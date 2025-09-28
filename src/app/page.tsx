'use client';

import { useState } from "react";
import { CardBox } from "@/components/CardBox";
import { TaskCard } from "@/components/TaskCard";
import type { CardArea, Task } from "../types/types";

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
    { id: 1, name: "area2", tasks: [{ id: 2, name: "taskname3" }] },
  ];
 
  const [kanban, setKanban] = useState<CardArea[]>(data);
  const [editing, setEditing] = useState<number>(-1);

  function addTask(area: CardArea, name: string) {
    const count = data.reduce((prev, value) => {return prev + value.tasks.length;}, 0);
    setKanban(kanban.map((currentArea) => {
      if (currentArea.id === area.id) {
        return {...currentArea, tasks: [...currentArea.tasks, {id: count+1, name: name}]};
      }
      return currentArea;
    }));
  }

  function setEditingFocus(id: number) {
    setEditing(id);
  }

  function unFocus() {
    setEditing(-1);
  }

  function editTask(targetTask: Task, newName: string) {
    setKanban(kanban.map((currentArea) => {
      return {...currentArea, tasks: currentArea.tasks.map((task) => {
        if (task === targetTask) {
          return {...task, name: newName};
        }
        return task;
      })};
    }));
  }

  return (
    <div className="p-5 flex gap-5 overflow-x-auto w-full">
      {kanban.map((area) => {
        return (
          <CardBox name={area.name} key={area.id} onAdd={() => addTask(area, "aaa")}>
            {area.tasks.map((task) => {
              return <TaskCard key={task.id} task={task} editing={editing} onClick={() => setEditingFocus(task.id)} unFocus={unFocus} onChange={editTask} />;
            })}
          </CardBox>
        );
      })}
    </div>
  );
}
