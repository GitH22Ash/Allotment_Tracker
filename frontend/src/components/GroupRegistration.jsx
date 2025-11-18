import { useState } from "react";
import { API } from "../api"; // adjust path if this component is in a different folder

const initialMemberState = { name: "", reg_no: "", cgpa: "" };

function GroupRegistration() {
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState(
        Array(5).fill(null).map(() => ({ ...initialMemberState }))
    );
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleMemberChange = (index, field, value) => {
        // Create a new array to avoid direct state mutation
        const updatedMembers = [...members];
        // Update the specific field for the specific member
        updatedMembers[index][field] = value;
        setMembers(updatedMembers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic validation
        if (!groupName.trim()) {
            setError("Group name cannot be empty.");
            return;
        }
        const isAnyMemberFieldEmpty = members.some(
            member => !member.name.trim() || !member.reg_no.trim() || !member.cgpa.trim()
        );
        if (isAnyMemberFieldEmpty) {
            setError("All member fields must be filled out.");
            return;
        }

        try {
            setLoading(true);
            await API.post("/groups/register", {
                group_name: groupName,
                members: members,
            });
            setSuccess("Group registered successfully!");
            setGroupName("");
            setMembers(Array(5).fill(null).map(() => ({ ...initialMemberState })));
        } catch (err) {
            console.error("Full error object:", err);
            console.error("Error response:", err.response);
            setError(err.response?.data?.msg || "An error occurred during registration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Register Your Project Group</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <label htmlFor="groupName" className="block text-lg font-medium text-gray-300 mb-2">
                        Group Name
                    </label>
                    <input
                        type="text"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="e.g., The Innovators"
                    />
                </div>

                {members.map((member, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Member {index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Registration No.</label>
                                <input
                                    type="text"
                                    value={member.reg_no}
                                    onChange={(e) => handleMemberChange(index, 'reg_no', e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    placeholder="e.g., S001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={member.cgpa}
                                    onChange={(e) => handleMemberChange(index, 'cgpa', e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    placeholder="e.g., 8.5"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {error && <div className="bg-red-500 text-white p-3 rounded text-center">{error}</div>}
                {success && <div className="bg-green-500 text-white p-3 rounded text-center">{success}</div>}

                <div className="text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-lg disabled:opacity-60"
                    >
                        {loading ? "Registering…" : "Register Group"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default GroupRegistration;