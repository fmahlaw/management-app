import React from 'react';
import './WorkerPopup.css';

interface WorkerPopupProps {
  worker: Worker;
  onClose: () => void;
}

const WorkerPopup: React.FC<WorkerPopupProps> = ({ worker, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>
          &#x2715;
        </span>
        <img src={worker.avatar} alt="Avatar" />
        <h2>{`${worker.first_name} ${worker.last_name}`}</h2>
        <p>Email: {worker.email}</p>
        <p>Position: {worker.position}</p>
      </div>
    </div>
  );
};

export default WorkerPopup;
