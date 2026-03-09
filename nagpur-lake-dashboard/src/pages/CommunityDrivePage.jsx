import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import lakesData from '../data/lakes.json';
import Navbar from '../components/Navbar';
import DriveForm from '../components/DriveForm';
import DriveCard from '../components/DriveCard';

const CommunityDrivePage = () => {
    const [drives, setDrives] = useState([]);
    const [lakeHealthMap, setLakeHealthMap] = useState({});
    const [loading, setLoading] = useState(true);

    // 1. Fetch Lake Health to filter the dropdown (Score > 25)
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
            const aggregation = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                const lakeId = data.lake_id;
                const plant = data.plant_percentage;
                if (plant == null) return;
                if (!aggregation[lakeId]) {
                    aggregation[lakeId] = { sum: 0, count: 0 };
                }
                aggregation[lakeId].sum += plant;
                aggregation[lakeId].count += 1;
            });

            const avgMap = {};
            Object.keys(aggregation).forEach((lakeId) => {
                avgMap[lakeId] = aggregation[lakeId].sum / aggregation[lakeId].count;
            });
            setLakeHealthMap(avgMap);
        });

        return () => unsub();
    }, []);

    // 2. Fetch Community Drives in realtime
    useEffect(() => {
        const q = query(collection(db, "community_drives"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const drivesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDrives(drivesList);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    // Filter lakes whose avg health score > 25
    const filteredLakes = lakesData.filter(lake => (lakeHealthMap[lake.lake_id] || 0) > 25);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Outfit',sans-serif]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Community <span className="text-[#4a5568]">Cleanup Drives</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Join hands with fellow citizens to restore our lakes. Below are the lakes that need immediate attention based on recent data.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Create Drive Form */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32">
                            <DriveForm lakes={filteredLakes} />

                            {/* Info Card */}
                            <div className="bg-[#5d6d7e] rounded-3xl p-8 text-white shadow-xl shadow-slate-200/50">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Why organize?
                                </h3>
                                <p className="text-blue-50 leading-relaxed mb-4">
                                    Lakes with a health score above 25% plant coverage require urgent attention. Community action is the fastest way to trigger government response and restore ecological balance.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10">
                                    <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                                    {filteredLakes.length} High-Observation Lakes
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Drives Dashboard */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Active Drives</h2>
                            <span className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-bold">
                                {drives.length} Drives Posted
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="w-12 h-12 border-4 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-400 font-medium">Loading community initiatives...</p>
                            </div>
                        ) : drives.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                {drives.map(drive => (
                                    <DriveCard key={drive.id} drive={drive} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No active drives yet</h3>
                                <p className="text-gray-500">Be the first to start a cleanup mission for one of the critical lakes!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CommunityDrivePage;
