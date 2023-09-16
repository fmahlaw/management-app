import React from 'react';

interface WorkerListItemProps {
  worker: Worker;
  onEmailClick: (worker: Worker) => void;
  onDeleteClick: (id: number) => void;
  onEditClick: (worker: Worker) => void;
}

const WorkerListItem: React.FC<WorkerListItemProps> = ({
  worker,
  onEmailClick,
  onDeleteClick,
  onEditClick,
}) => {
  return (
    <li key={worker.id}>
      {worker.first_name} {worker.last_name} -{' '}
      <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => onEmailClick(worker)}>
        {worker.email}
      </span>
      <button onClick={() => onDeleteClick(worker.id)}>Delete</button>
      <button onClick={() => onEditClick(worker)}>Edit</button>
    </li>
  );
};

export default WorkerListItem;
