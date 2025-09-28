import { useEffect, useRef } from "react";
import type { Task } from "@/types/types";

type Props = {
  task: Task;
  editing: number;
  onClick: () => void;
  onChange: (targetTask: Task, newName: string) => void;
  unFocus: () => void;
};

export function TaskCard({ unFocus, task, editing, onClick, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    unFocus();
  }

  useEffect(() => {
    if (task.id === editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing, task.id]);

  return (
    <button type="button" onClick={onClick} className="bg-white w-full text-lg border-2 p-2 mb-2 cursor-pointer text-left">
        {(task.id === editing) ? 
          <input ref={inputRef} value={task.name} onChange={(e) => onChange(task, e.target.value)} className="w-full"  onBlur={handleBlur} />
         : 
        <div>{task.name}</div>
         }
    </button>
  );
}