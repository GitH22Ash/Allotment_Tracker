import { useState, useEffect } from 'react';
import { API } from '../api'; // adjust path if your file location differs

function AdminPanel() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('create'); // 'create', 'supervisors', 'groups', 'assign'
    
    // Supervisor creation form
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Data states
    const [supervisors, setSupervisors] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState('');

    useEffect(() => {
        if (activeTab === 'supervisors') {
            fetchSupervisors();
        } else if (activeTab === 'groups') {
            fetchGroups();
        }
    }, [activeTab]);

    const fetchSupervisors = async () => {
        try {
            setLoading(true);
            const response = await API.get('/admin/supervisors');
            setSupervisors(response.data);
        } catch (err) {
            console.error("Error fetching supervisors:", err);
            setError('Failed to fetch supervisors');
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await API.get('/admin/groups');
            setGroups(response.data);
        } catch (err) {
            console.error("Error fetching groups:", err);
            setError('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

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
            await API.post('/admin/supervisors/create', {
                emp_id: empId,
                name,
                email,
                password
            });
            setMessage('Supervisor created successfully!');
            setEmpId(''); setName(''); setEmail(''); setPassword('');
        } catch (err) {
            console.error(err);
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
            const response = await API.post('/admin/assign-groups');
            setMessage(response.data.msg);
            if (activeTab === 'groups') fetchGroups();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Failed to assign groups.');
        } finally {
            setLoading(false);
        }
    };

    const handleManualAssign = async () => {
        if (!selectedGroup || !selectedSupervisor) {
            setError('Please select both a group and a supervisor.');
            return;
        }

        setError('');
        setMessage('');

        try {
            setLoading(true);
            await API.put(`/admin/groups/${selectedGroup}/assign`, {
                supervisorId: selectedSupervisor
            });
            setMessage('Group assigned successfully!');
            setSelectedGroup('');
            setSelectedSupervisor('');
            fetchGroups();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Failed to assign group.');
        } finally {
            setLoading(false);
        }
    };

    const handleUnassign = async (groupId) => {
        setError('');
        setMessage('');

        try {
            setLoading(true);
            await API.put(`/admin/groups/${groupId}/unassign`);
            setMessage('Group unassigned successfully!');
            fetchGroups();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Failed to unassign group.');
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ tabKey, label }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tabKey
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>
            
            {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
            {message && <div className="bg-green-500 text-white p-3 rounded mb-4">{message}</div>}
            
            <div className="flex space-x-1 mb-6 border-b">
                <TabButton tabKey="create" label="Create Supervisor" />
                <TabButton tabKey="supervisors" label="View Supervisors" />
                <TabButton tabKey="groups" label="View Groups" />
                <TabButton tabKey="assign" label="Group Assignment" />
            </div>

            {activeTab === 'create' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-white">Create New Supervisor</h2>
                    <form onSubmit={handleCreateSupervisor} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Employee ID</label>
                            <input type="text" value={empId} onChange={(e)=>setEmpId(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500" placeholder="e.g., T001" />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Full Name</label>
                            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500" placeholder="Dr. John Smith" />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500" placeholder="john.smith@university.edu" />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Password</label>
                            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500" placeholder="Enter password" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded transition duration-300">
                            {loading ? 'Creating...' : 'Create Supervisor'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'supervisors' && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">Registered Supervisors</h2>
                    {loading ? <p className="text-center">Loading supervisors...</p> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Groups</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Groups</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {supervisors.map((supervisor) => (
                                        <tr key={supervisor.emp_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supervisor.emp_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supervisor.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supervisor.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supervisor.current_groups}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supervisor.max_groups}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${supervisor.current_groups >= supervisor.max_groups ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {supervisor.current_groups >= supervisor.max_groups ? 'Full' : 'Available'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'groups' && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">Registered Groups</h2>
                    {loading ? <p className="text-center">Loading groups...</p> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Supervisor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {groups.map((group) => (
                                        <tr key={group.group_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.group_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.group_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.member_count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.supervisor_name || 'Unassigned'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${group.assigned_supervisor_id ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {group.assigned_supervisor_id ? 'Assigned' : 'Unassigned'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {group.assigned_supervisor_id && (
                                                    <button onClick={() => handleUnassign(group.group_id)} className="text-red-600 hover:text-red-900 transition-colors" disabled={loading}>
                                                        Unassign
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'assign' && (
                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6 text-white">Manual Group Assignment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Select Group</label>
                                <select value={selectedGroup} onChange={(e)=>setSelectedGroup(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500">
                                    <option value="">Choose a group...</option>
                                    {groups.filter(g => !g.assigned_supervisor_id).map((group) => (
                                        <option key={group.group_id} value={group.group_id}>{group.group_name} (ID: {group.group_id})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Select Supervisor</label>
                                <select value={selectedSupervisor} onChange={(e)=>setSelectedSupervisor(e.target.value)} className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500">
                                    <option value="">Choose a supervisor...</option>
                                    {supervisors.filter(s => s.current_groups < s.max_groups).map((supervisor) => (
                                        <option key={supervisor.emp_id} value={supervisor.emp_id}>{supervisor.name} ({supervisor.current_groups}/{supervisor.max_groups} groups)</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button onClick={handleManualAssign} disabled={loading || !selectedGroup || !selectedSupervisor} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded transition duration-300">
                            {loading ? 'Assigning...' : 'Assign Group'}
                        </button>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6 text-white">Automatic Group Assignment</h2>
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
                            
                            <button onClick={handleAssignGroups} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-4 rounded transition duration-300">
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
            )}
        </div>
    );
}

export default AdminPanel;
