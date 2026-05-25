import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Save, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterHospital = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hospitalName: '',
        registrationNumber: '',
        password: '',
        type: 'Public', // Public, Private, Research
        address: '',
        city: '',
        contact: {
            phone: '',
            email: '',
            website: ''
        },
        authorizedPerson: {
            name: '',
            designation: '',
            phone: ''
        },
        facilities: {
            hlaTyping: false,
            transplantUnit: false,
            bloodBank: false
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else if (type === 'checkbox') {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: checked }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create Firebase Auth user
            const userCredential = await createUserWithEmailAndPassword(auth, formData.contact.email, formData.password);
            const user = userCredential.user;

            // Remove password before saving to Firestore
            const { password, ...hospitalData } = formData;
            const newHospital = { 
                ...hospitalData, 
                registeredAt: new Date().toISOString()
            };
            
            // Save hospital doc with UID as ID
            await setDoc(doc(db, 'hospitals', user.uid), newHospital);
            
            alert('Hospital Registered Successfully!');
            navigate('/hospital-dashboard');
        } catch (error) {
            console.error("Error registering hospital: ", error);
            alert("Failed to register hospital. " + error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Building2 className="w-6 h-6" />
                        Hospital Registration
                    </h2>
                    <p className="text-blue-100">Join our network to manage donors and facilitate life-saving transplants.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* 1. General Info */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <ShieldCheck className="text-blue-600 w-5 h-5" />
                                Institutional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="hospitalName" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Global Medical Center" 
                                        value={formData.hospitalName} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration / License Number</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="registrationNumber" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="HOS-123456" 
                                        value={formData.registrationNumber} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution Type</label>
                                    <select 
                                        name="type" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        value={formData.type} 
                                        onChange={handleChange}
                                    >
                                        <option value="Public">Public Hospital</option>
                                        <option value="Private">Private Medical Center</option>
                                        <option value="Research">Research & University Hospital</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 2. Contact & Location */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <MapPin className="text-blue-600 w-5 h-5" />
                                Contact & Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="address" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="123 Medical Way, Healthcare District" 
                                        value={formData.address} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="city" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Metropolis" 
                                        value={formData.city} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input 
                                        required 
                                        type="email" 
                                        name="contact.email" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="admin@hospital.com" 
                                        value={formData.contact.email} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Password</label>
                                    <input 
                                        required 
                                        type="password" 
                                        name="password" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Secure Password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input 
                                        required 
                                        type="tel" 
                                        name="contact.phone" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="+1 888-HOSPITAL" 
                                        value={formData.contact.phone} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                                    <input 
                                        type="url" 
                                        name="contact.website" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="https://www.hospital.com" 
                                        value={formData.contact.website} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 3. Facilities */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Clock className="text-blue-600 w-5 h-5" />
                                Available Facilities
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        name="facilities.hlaTyping"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                        checked={formData.facilities.hlaTyping} 
                                        onChange={handleChange} 
                                    />
                                    <span className="text-sm font-medium text-gray-700">In-house HLA Typing Lab</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        name="facilities.transplantUnit"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                        checked={formData.facilities.transplantUnit} 
                                        onChange={handleChange} 
                                    />
                                    <span className="text-sm font-medium text-gray-700">Marrow Transplant Unit</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        name="facilities.bloodBank"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                        checked={formData.facilities.bloodBank} 
                                        onChange={handleChange} 
                                    />
                                    <span className="text-sm font-medium text-gray-700">Blood Bank Services</span>
                                </label>
                            </div>
                        </section>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-6"
                        >
                            <Building2 className="w-5 h-5" />
                            Register Hospital & Access Portal
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterHospital;
