import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    onSnapshot, 
    serverTimestamp, 
    query, 
    orderBy 
} from 'firebase/firestore';
import Navbar from '../components/Navbar';
import lakesData from '../data/lakes.json';

const Actions = () => {
    // 1. User state (Set to esha@gmail.com and admin: 1 to enable editing)
    const [user, setUser] = useState(null); 
    
    const isAdmin = user?.email === 'esha@gmail.com' && user?.admin === 1;

    const [actions, setActions] = useState([]);
    const [criticalLakes, setCriticalLakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAction, setNewAction] = useState({
        lake_name: '',
        location: '',
        cleanup_status: 'Pending'
    });

    // 1. Fetch Lake Health to find Critical Lakes (Avg > 50)
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
            const reportsByLake = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                const lakeId = data.lake_id;
                if (data.plant_percentage == null) return;
                if (!reportsByLake[lakeId]) reportsByLake[lakeId] = [];
                reportsByLake[lakeId].push({
                    plant: data.plant_percentage,
                    time: data.timestamp || data.createdAt || 0
                });
            });

            const criticalList = [];
            Object.keys(reportsByLake).forEach((lakeId) => {
                const sorted = reportsByLake[lakeId].sort((a, b) => a.time - b.time);
                let currentEma = 0;
                sorted.forEach((report, index) => {
                    if (index === 0) currentEma = report.plant;
                    else currentEma = (report.plant * 0.2) + (currentEma * 0.8);
                });

                if (currentEma > 50) {
                    const lake = lakesData.find(l => l.lake_id === lakeId);
                    if (lake) criticalList.push(lake);
                }
            });
            setCriticalLakes(criticalList);
        });
        return () => unsub();
    }, []);

    // 2. Real-time listener for critical_status
    useEffect(() => {
        const q = query(collection(db, "critical_status"), orderBy("created_at", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const actionsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setActions(actionsList);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const handleCreateAction = async (e) => {
        e.preventDefault();
        if (!newAction.lake_name || !newAction.location) return;

        try {
            await addDoc(collection(db, "critical_status"), {
                ...newAction,
                created_at: serverTimestamp(),
                last_updated: serverTimestamp()
            });
            setNewAction({ lake_name: '', location: '', cleanup_status: 'Pending' });
        } catch (error) {
            console.error("Error adding action:", error);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const actionRef = doc(db, "critical_status", id);
            await updateDoc(actionRef, {
                cleanup_status: newStatus,
                last_updated: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-red-100 text-red-700 border-red-200';
            case 'Ongoing': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '---';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Outfit',sans-serif]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            Critical Lake <span className="text-[#2563eb]">Actions</span>
                        </h1>
                        <p className="text-gray-500 text-lg">Manage and monitor restoration progress across Nagpur's critical water bodies.</p>
                    </div>

                    {/* Simulation: Admin Login (Feasible way to test) */}
                    {!isAdmin ? (
                        <button 
                            onClick={() => setUser({ email: 'esha@gmail.com', admin: 1 })}
                            className="bg-gray-100/50 hover:bg-gray-200 text-gray-400 text-xs px-3 py-1.5 rounded-lg border border-gray-200 transition-all font-bold uppercase tracking-wider h-fit"
                        >
                            Log in as Esha (Admin)
                        </button>
                    ) : (
                        <button 
                            onClick={() => setUser(null)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs px-3 py-1.5 rounded-lg border border-blue-200 transition-all font-bold uppercase tracking-wider h-fit"
                        >
                            Log out (Guest Mode)
                        </button>
                    )}
                </div>

                {/* Admin Interface: Create Action */}
                {isAdmin && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-12">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                            Initiate New Restoration Action
                        </h2>
                        <form onSubmit={handleCreateAction} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <select
                                value={newAction.lake_name}
                                onChange={(e) => {
                                    const lake = criticalLakes.find(l => l.name === e.target.value);
                                    setNewAction({
                                        ...newAction, 
                                        lake_name: e.target.value,
                                        location: lake ? `Nagpur, ${lake.name} area` : ''
                                    });
                                }}
                                className="px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none bg-gray-50 transition-all font-medium"
                                required
                            >
                                <option value="">Select Critical Lake...</option>
                                {criticalLakes.map(lake => (
                                    <option key={lake.lake_id} value={lake.name}>{lake.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Location"
                                value={newAction.location}
                                onChange={(e) => setNewAction({...newAction, location: e.target.value})}
                                className="px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                required
                            />
                            <select
                                value={newAction.cleanup_status}
                                onChange={(e) => setNewAction({...newAction, cleanup_status: e.target.value})}
                                className="px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none bg-gray-50 transition-all font-medium"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <button
                                type="submit"
                                className="bg-[#455a64] text-white font-bold py-3 rounded-xl hover:bg-[#37474f] transition-all shadow-lg shadow-slate-200"
                            >
                                Create Entry
                            </button>
                        </form>
                    </div>
                )}

                {/* Status Table */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Lake Name</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Cleanup Status</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>
                                    <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-medium">
                                            Loading statuses...
                                        </td>
                                    </tr>
                                ) : actions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-medium text-lg">
                                            No critical actions recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    actions.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6 font-bold text-gray-800">{item.lake_name}</td>
                                            <td className="px-8 py-6 text-gray-600 font-medium">{item.location}</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(item.cleanup_status)}`}>
                                                    {item.cleanup_status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-gray-500 font-medium">
                                                {formatDate(item.last_updated)}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {isAdmin ? (
                                                    <select
                                                        value={item.cleanup_status}
                                                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                                        className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer hover:border-blue-300 transition-all"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Ongoing">Ongoing</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                ) : (
                                                    <span className="text-gray-300 italic text-sm font-medium">Read-only</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Actions;
