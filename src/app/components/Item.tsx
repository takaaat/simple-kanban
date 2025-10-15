import { Task } from '@/types/types';
import React, { forwardRef } from 'react';

type ItemProps = React.HTMLAttributes<HTMLDivElement> & {
  task: Task;
  children?: React.ReactNode;
};

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ task, ...props }, ref) => {
    return (
      <div {...props} ref={ref} className="p-2 m-3 bg-amber-200">
        {task.name}
      </div>
    );
  }
);
