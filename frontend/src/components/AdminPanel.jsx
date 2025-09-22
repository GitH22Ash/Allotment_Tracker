import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AdminPanel() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    // Supervisor creation form
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateSupervisor = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!empId || !name || !email || !password) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${API_URL}/admin/supervisors/create`, {
                emp_id: empId,
                name,
                email,
                password
            });
            setMessage('Supervisor created successfully!');
            // Clear form
            setEmpId('');
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create supervisor.');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignGroups = async () => {
        setError('');
        setMessage('');
        
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/admin/assign-groups`);
            setMessage(response.data.msg);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to assign groups.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>
            
            {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
            {message && <div className="bg-green-500 text-white p-3 rounded mb-4">{message}</div>}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Supervisor Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-white">Create New Supervisor</h2>
                    <form onSubmit={handleCreateSupervisor} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Employee ID</label>
                            <input
                                type="text"
                                value={empId}
                                onChange={(e) => setEmpId(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="e.g., T001"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="Dr. John Smith"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="john.smith@university.edu"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="Enter password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded transition duration-300"
                        >
                            {loading ? 'Creating...' : 'Create Supervisor'}
                        </button>
                    </form>
                </div>

                {/* Group Assignment Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-white">Group Assignment</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-700 p-4 rounded">
                            <h3 className="text-lg font-medium text-white mb-2">Automatic Group Assignment</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                This will automatically assign all unassigned groups to supervisors based on their preferences and capacity.
                            </p>
                            <ul className="text-gray-400 text-sm mb-4 space-y-1">
                                <li>• Groups are randomly distributed</li>
                                <li>• Respects supervisor maximum group limits</li>
                                <li>• Ensures fair distribution based on capacity</li>
                            </ul>
                        </div>
                        
                        <button
                            onClick={handleAssignGroups}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-4 rounded transition duration-300"
                        >
                            {loading ? 'Assigning Groups...' : 'Assign Groups Automatically'}
                        </button>
                        
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                            <p className="text-yellow-800 text-sm">
                                <strong>Note:</strong> Make sure supervisors have set their group preferences before running the assignment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;