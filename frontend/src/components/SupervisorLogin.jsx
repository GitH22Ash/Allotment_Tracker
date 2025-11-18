import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api"; // adjust path if this file sits in a different folder

function SupervisorLogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [empId, setEmpId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/supervisors/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            setSuccess("Login successful! Redirecting...");
            setTimeout(() => {
                navigate("/supervisor/dashboard");
            }, 800);
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.msg || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!empId || !name || !email || !password) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            setLoading(true);
            await API.post("/supervisors/register", {
                emp_id: empId,
                name,
                email,
                password,
            });
            setSuccess("Registration successful! You can now login.");
            setIsLogin(true);
            // Clear form
            setEmpId("");
            setName("");
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.response?.data?.msg || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-l-lg font-medium ${
                            isLogin
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-r-lg font-medium ${
                            !isLogin
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                    >
                        Register
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? "Supervisor Login" : "Supervisor Registration"}
                </h2>

                {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-500 text-white p-3 rounded mb-4">{success}</div>}

                <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
                    {!isLogin && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2" htmlFor="empId">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    id="empId"
                                    value={empId}
                                    onChange={(e) => setEmpId(e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    required={!isLogin}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    required={!isLogin}
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="email">
                            Email
                        </label>
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
                        <label className="block text-gray-300 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300 disabled:opacity-60"
                    >
                        {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-400">
                    <Link to="/" className="hover:underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SupervisorLogin;