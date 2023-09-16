import React, { useState, useEffect } from 'react';
import axios from 'axios';

import WorkerListItem from './WorkerListItem';
import WorkerPopup from './WorkerPopup';

const WorkerList: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [newWorker, setNewWorker] = useState<Worker>({ id: 0, first_name: '', last_name: '', position: '', email: '' });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
    const [showResponse, setShowResponse] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [filter, setFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const filteredWorkers = workers.filter(
        (worker) =>
            worker.first_name.toLowerCase().includes(filter.toLowerCase()) ||
            worker.last_name.toLowerCase().includes(filter.toLowerCase()) ||
            worker.position.toLowerCase().includes(filter.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredWorkers.slice(indexOfFirstItem, indexOfLastItem);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://reqres.in/api/users?page=1');
                const workersData = response.data.data.map((worker: any) => ({
                    id: worker.id,
                    first_name: worker.first_name,
                    last_name: worker.last_name,
                    position: 'Position', // Set a default position (you can change this as needed)
                    email: worker.email,
                    avatar: worker.avatar // Added avatar field
                }));
                setWorkers(workersData);
            } catch (error) {
                console.error('Error fetching worker data:', error);
            }
        };

        fetchData();
    }, []);

    const isFormValid = () => {
        return newWorker.first_name.trim() !== '' &&
            newWorker.last_name.trim() !== '' &&
            newWorker.position.trim() !== '' &&
            newWorker.email.trim() !== '' &&
            newWorker.email.includes('@');
    };

    const handleAddWorker = () => {
        if (isFormValid()) {
            setWorkers([...workers, { ...newWorker, id: Math.max(...workers.map(worker => worker.id), 0) + 1 }]);
            setNewWorker({ id: 0, first_name: '', last_name: '', position: '', email: '' });
            setResponseMessage('Worker added successfully!');
            setShowResponse(true);
        } else {
            setResponseMessage('Please fill in all fields and ensure the email is valid.');
            setShowResponse(true);
        }
    };

    const handleDeleteWorker = (id: number) => {
        setWorkers(workers.filter(worker => worker.id !== id));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setNewWorker(prevWorker => ({ ...prevWorker, [field]: e.target.value }));
    };

    const handleEditWorker = (worker: Worker) => {
        setNewWorker(worker);
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        if (isFormValid()) {
            const editedWorkers = workers.map(worker =>
                worker.id === newWorker.id ? { ...newWorker } : worker
            );
            setWorkers(editedWorkers);
            setNewWorker({ id: 0, first_name: '', last_name: '', position: '', email: '' });
            setIsEditing(false);
        } else {
            alert('Please fill in all fields and ensure the email is valid.');
        }
    };

    const handleEmailClick = (worker: Worker) => {
        setSelectedWorker(worker);
      };
    
      const handleClosePopup = () => {
        setSelectedWorker(null);
      };

    return (
        <div>
            <input
                type="text"
                placeholder="Search by name or position"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />


            <h1>Worker List</h1>
            <div>
                <input
                    type="text"
                    placeholder="First Name"
                    value={newWorker.first_name}
                    onChange={(e) => handleChange(e, 'first_name')}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newWorker.last_name}
                    onChange={(e) => handleChange(e, 'last_name')}
                />
                <input
                    type="text"
                    placeholder="Position"
                    value={newWorker.position}
                    onChange={(e) => handleChange(e, 'position')}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newWorker.email}
                    onChange={(e) => handleChange(e, 'email')}
                />
                {isEditing ? (
                    <button onClick={handleSaveChanges}>Save Changes</button>
                ) : (
                    <button onClick={handleAddWorker}>Add Worker</button>
                )}
            </div>
            <ul>
                {currentItems.map((worker) => (
                    <WorkerListItem
                        key={worker.id}
                        worker={worker}
                        onEmailClick={handleEmailClick}
                        onDeleteClick={handleDeleteWorker}
                        onEditClick={handleEditWorker}
                    />
                ))}
            </ul>

            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                    disabled={currentItems.length < itemsPerPage}
                >
                    Next
                </button>
            </div>
            {showResponse && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                            textAlign: 'center',
                        }}
                    >
                        <p>{responseMessage}</p>
                        <button onClick={() => setShowResponse(false)}>OK</button>
                    </div>
                </div>
            )}

            {selectedWorker && (
                <WorkerPopup worker={selectedWorker} onClose={handleClosePopup} />
            )}
        </div>
    );
};

export default WorkerList;
