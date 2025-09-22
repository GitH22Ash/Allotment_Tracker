import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SupervisorDashboard() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/supervisor/login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/my-groups', {
                    headers: { 'x-auth-token': token }
                });
                setGroups(res.data);
            } catch (err) {
                console.error("Error fetching groups:", err);
                setError('Failed to load dashboard data. Please log in again.');
                localStorage.removeItem('token'); // Clear bad token
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [navigate]);

    const handleMarkUpdate = async (student_reg_no, group_id, review_number, marks) => {
        const payload = {
            student_reg_no,
            group_id,
            review_number,
            marks: marks === '' ? null : Number(marks)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/supervisors/marks', payload, {
                headers: { 'x-auth-token': token }
            });
             // Clear any previous error on a successful update
            setError('');
        } catch (err) {
            // FIX: Use the 'err' variable for debugging and set a user-friendly error state.
            console.error('Failed to update mark:', err);
            setError(`Failed to update mark for student ${student_reg_no}. Please refresh and try again.`);
        }
    };

    const handleInputChange = (e, groupIndex, memberIndex, reviewNumber) => {
        const newGroups = [...groups];
        newGroups[groupIndex].members[memberIndex][`review${reviewNumber}_marks`] = e.target.value;
        setGroups(newGroups);
    };

    if (loading) return <p className="text-center">Loading dashboard...</p>;
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Supervisor Dashboard</h1>
            
            {/* Display error message if it exists */}
            {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

            {groups.length === 0 ? (
                <p>No groups have been assigned to you yet.</p>
            ) : (
                <div className="space-y-8">
                    {groups.map((group, groupIndex) => (
                        <div key={group.group_id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-700">{group.group_name}</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review 1</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review 2</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review 3</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review 4</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {group.members.map((member, memberIndex) => (
                                            <tr key={member.reg_no}>
                                                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{member.reg_no}</td>
                                                {[1, 2, 3, 4].map(reviewNumber => (
                                                    <td key={reviewNumber} className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            className="w-20 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                            value={member[`review${reviewNumber}_marks`] || ''}
                                                            onChange={(e) => handleInputChange(e, groupIndex, memberIndex, reviewNumber)}
                                                            onBlur={(e) => handleMarkUpdate(member.reg_no, group.group_id, reviewNumber, e.target.value)}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SupervisorDashboard;
