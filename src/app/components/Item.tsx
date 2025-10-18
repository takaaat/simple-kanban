import { Task } from '@/types/types';
import React, { forwardRef } from 'react';

type ItemProps = React.HTMLAttributes<HTMLDivElement> & {
  task: Task;
  children?: React.ReactNode;
};

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ task, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className="bg-white w-full text-lg border-2 mb-2"
      >
        {task.name}
      </div>
    );
  }
);
