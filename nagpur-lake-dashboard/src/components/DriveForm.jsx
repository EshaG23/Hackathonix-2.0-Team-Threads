import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DriveForm = ({ lakes }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        lake_name: '',
        location: '',
        date: '',
        time: '',
        whatsapp_link: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "community_drives"), {
                ...formData,
                createdAt: serverTimestamp(),
                joined: false
            });

            // Reset form
            setFormData({
                lake_name: '',
                location: '',
                date: '',
                time: '',
                whatsapp_link: '',
                description: ''
            });
            alert("Cleanup drive created successfully!");
        } catch (error) {
            console.error("Error creating drive:", error);
            alert("Failed to create drive. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Organize a Cleanup Drive</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Lake</label>
                    <select
                        name="lake_name"
                        value={formData.lake_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all appearance-none bg-gray-50"
                    >
                        <option value="">Choose a critical lake...</option>
                        {lakes.map(lake => (
                            <option key={lake.lake_id} value={lake.name}>{lake.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Meeting Point</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Near Main Entrance"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Time</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">WhatsApp Group Link</label>
                    <input
                        type="url"
                        name="whatsapp_link"
                        value={formData.whatsapp_link}
                        onChange={handleChange}
                        placeholder="https://chat.whatsapp.com/..."
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Mission Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="What needs to be done? (e.g. Plastic removal, hyacinth clearing)"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all bg-gray-50 resize-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${loading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-[#455a64] text-white hover:bg-[#37474f] shadow-slate-200 hover:shadow-slate-300'
                            }`}
                    >
                        {loading ? 'Creating Drive...' : 'Launch Cleanup Drive'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DriveForm;
