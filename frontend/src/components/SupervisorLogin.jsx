import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function SupervisorRegister() {
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!empId || !name || !email || !password) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            await axios.post(`${API_URL}/supervisors/register`, {
                emp_id: empId,
                name,
                email,
                password
            });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/supervisor-login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Supervisor Signup</h2>
                {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-500 text-white p-3 rounded mb-4">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="empId">Employee ID</label>
                        <input
                            type="text"
                            id="empId"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300">
                        Sign Up
                    </button>
                </form>
                 <div className="text-center mt-4">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link to="/supervisor-login" className="text-blue-400 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SupervisorRegister;
