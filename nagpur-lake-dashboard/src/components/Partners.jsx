import React from "react";
import Navbar from "./Navbar";

const ngos = [
    {
        name: "Vidarbha Nature Conservation Society (VNCS)",
        use: [
            "Local biodiversity & lake ecosystem expertise",
            "Volunteer mobilization for cleanup drives",
            "Environmental awareness & training"
        ],
        phone: "+91 712 257 6950",
        email: "vncs.ngp5@gmail.com",
        address: "KT Nagar, Katol Road, Nagpur"
    },
    {
        name: "CHIP Nagpur (Nisargavedh Project)",
        use: [
            "Eco-restoration planning for lakes",
            "Community engagement & student volunteers",
            "Tree plantation & water conservation support"
        ],
        phone: "+91 96658 20463",
        email: "chipnagpurngo@gmail.com",
        address: "Tilak Nagar, Nagpur"
    },
    {
        name: "Green Vigil Foundation",
        use: [
            "Green Vigil Foundation is an environmental NGO based in Nagpur, Maharashtra",
            "It works on environmental protection, sustainability, and public awareness through campaigns.",
            "The foundation actively promotes water and eco-friendly practices"
        ],
        phone: "Via local office",
        email: "greenvigil@org.com",
        address: "Nagpur (Regional Office)"
    },
    {
        name: "Art of Living – Nagpur Volunteers",
        use: [
            "Large-scale volunteer mobilization",
            "Cleanliness & lake restoration drives",
            "Public awareness & participation"
        ],
        phone: "Local Ashram Contact",
        email: "info@artofliving.org",
        address: "Katol Road, Nagpur"
    }
];

const hyacinthPartners = [
    {
        name: "Swachhatapukare Foundation",
        use: [
            "Conversion of water hyacinth into bio-fertilizer & compost",
            "Training communities to reuse invasive weeds",
            "Sustainable livelihood & waste-to-resource model"
        ],
        phone: "Via website",
        email: "contact@swachhatapukare.com",
        address: "India (Project-based operations)"
    },
    {
        name: "Saguna Rural Foundation (SJT)",
        use: [
            "Technical guidance on hyacinth removal",
            "Reuse of biomass as soil enrichers",
            "Lake & waterbody rejuvenation models"
        ],
        phone: "+91 98335 20306",
        email: "info@sagunafoundation.ngo",
        address: "Raigad, Maharashtra"
    }
];

const Card = ({ item, isEco }) => (
    <div className="group relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
        {/* Decorative background element */}
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isEco ? 'bg-green-500' : 'bg-blue-500'}`}></div>

        <div className="relative z-10">
            <h3 className={`text-2xl font-bold mb-4 tracking-tight ${isEco ? 'text-green-700' : 'text-blue-700'}`}>
                {item.name}
            </h3>

            <div className="mb-6">
                <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Impact Areas</p>
                <ul className="space-y-2">
                    {item.use.map((u, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isEco ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                            <span className="text-[0.95rem] leading-relaxed">{u}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span>{item.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span className="truncate">{item.email}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-500">
                    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>{item.address}</span>
                </div>
            </div>
        </div>
    </div>
);

const Partners = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Outfit',sans-serif]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-200 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Our <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Eco-System Partners</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Collaboration is the heart of restoration. Join forces with the organizations leading Nagpur's blue-green revolution.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-24">
                {/* NGOs SECTION */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-800">NGO Strategic Partners</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {ngos.map((ngo, index) => (
                            <Card key={index} item={ngo} isEco={false} />
                        ))}
                    </div>
                </section>

                {/* WATER HYACINTH REUSE SECTION */}
                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-10 w-2 bg-green-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-800">Circular Economy Partners</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {hyacinthPartners.map((org, index) => (
                            <Card key={index} item={org} isEco={true} />
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <div className="mt-32 p-12 rounded-[2rem] bg-gradient-to-br from-gray-900 to-blue-900 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,100 Q25,50 50,100 T100,100" fill="none" stroke="white" strokeWidth="0.5" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Become a Partner?</h2>
                        <p className="text-blue-100 mb-10 text-lg max-w-xl mx-auto">
                            If you represent an organization that can contribute to lake health or waste reuse, we'd love to collaborate.
                        </p>
                        <button className="bg-white text-blue-900 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                            Partner with Us
                        </button>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
                <p>&copy; 2024 Nagpur Lake Dashboard. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Partners;
