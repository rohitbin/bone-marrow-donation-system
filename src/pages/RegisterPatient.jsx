import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Activity } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

const HLA_LOCI = ['A', 'B', 'C', 'DRB1', 'DQB1'];

const RegisterPatient = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        gender: '',
        disease: '',
        hospital: '',
        doctor: '',
        bloodGroup: '',
        hla: {
            A: ['', ''],
            B: ['', ''],
            C: ['', ''],
            DRB1: ['', ''],
            DQB1: ['', ''],
            DPB1: ['', '']
        },
        urgency: 'Stable',
        familyDonor: false,
        contact: {
            phone: '',
            email: ''
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
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleHLAListChange = (locus, index, value) => {
        setFormData(prev => {
            const prevValue = prev.hla[locus][index] || '';
            if (value.length < prevValue.length) {
                return {
                    ...prev,
                    hla: {
                        ...prev.hla,
                        [locus]: prev.hla[locus].map((v, i) => i === index ? value.replace(/[^0-9:]/g, '') : v)
                    }
                };
            }

            let clean = value.replace(/[^0-9]/g, '');
            let formattedValue = clean;
            if (clean.length >= 2) {
                formattedValue = clean.slice(0, 2) + ':' + clean.slice(2);
            }

            return {
                ...prev,
                hla: {
                    ...prev.hla,
                    [locus]: prev.hla[locus].map((v, i) => i === index ? formattedValue : v)
                }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let hospitalId = null;
            let hospitalName = formData.hospital;
            
            if (auth.currentUser) {
                hospitalId = auth.currentUser.uid;
                const hDoc = await getDoc(doc(db, 'hospitals', hospitalId));
                if(hDoc.exists()) {
                    hospitalName = hDoc.data().hospitalName;
                }
            }
            
            const newPatient = { 
                ...formData, 
                hospitalId,
                hospital: hospitalName,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'patients'), newPatient);
            
            alert('Patient Registered! Matching search starting...');
            navigate(`/results/${docRef.id}`);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to register patient. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Search className="w-6 h-6" />
                        Find a Donor
                    </h2>
                    <p className="text-blue-100">Enter patient HLA data to search for a life-saving match in our registry.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Patient & Hospital Info */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Heart className="text-blue-600 w-5 h-5" />
                                Patient Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Full Name</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="patientName" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Name of patient" 
                                        value={formData.patientName} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input 
                                            required 
                                            type="number" 
                                            name="age" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="30" 
                                            value={formData.age} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select 
                                            required 
                                            name="gender" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            value={formData.gender} 
                                            onChange={handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition / Disease</label>
                                    <select 
                                        required 
                                        name="disease" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        value={formData.disease} 
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Leukemia">Leukemia</option>
                                        <option value="Thalassemia">Thalassemia</option>
                                        <option value="Sickle Cell Anemia">Sickle Cell Anemia</option>
                                        <option value="Aplastic Anemia">Aplastic Anemia</option>
                                        <option value="Lymphoma">Lymphoma</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                        <select 
                                            required 
                                            name="bloodGroup" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            value={formData.bloodGroup} 
                                            onChange={handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                                        <select 
                                            required 
                                            name="urgency" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            value={formData.urgency} 
                                            onChange={handleChange}
                                        >
                                            <option value="Critical">Critical</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Stable">Stable</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="hospital" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="City Hospital" 
                                        value={formData.hospital} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="doctor" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Dr. Smith" 
                                        value={formData.doctor} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                     <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                            checked={formData.familyDonor} 
                                            onChange={(e) => setFormData(prev => ({ ...prev, familyDonor: e.target.checked }))} 
                                        />
                                        <span className="text-sm font-medium text-gray-700">Family donor screened and unavailable (Recommended)</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* HLA Typing */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Activity className="text-blue-600 w-5 h-5" />
                                Patient HLA Typing
                            </h3>
                            <p className="text-sm text-gray-500">Ensure HLA Typing is 100% matched with hospital reports for best results.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {HLA_LOCI.map(locus => (
                                    <div key={locus} className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm">
                                        <label className="block text-sm font-bold text-gray-800 mb-3">HLA-{locus}</label>
                                        <div className="flex gap-2">
                                            <input 
                                                required 
                                                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                placeholder="Val 1" 
                                                value={formData.hla[locus][0]} 
                                                onChange={(e) => handleHLAListChange(locus, 0, e.target.value)} 
                                            />
                                            <input 
                                                required 
                                                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                placeholder="Val 2" 
                                                value={formData.hla[locus][1]} 
                                                onChange={(e) => handleHLAListChange(locus, 1, e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="p-5 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                                    <label className="block text-sm font-bold text-gray-600 mb-3">HLA-DPB1 (Optional)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="Val 1" 
                                            value={formData.hla.DPB1[0]} 
                                            onChange={(e) => handleHLAListChange('DPB1', 0, e.target.value)} 
                                        />
                                        <input 
                                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="Val 2" 
                                            value={formData.hla.DPB1[1]} 
                                            onChange={(e) => handleHLAListChange('DPB1', 1, e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-6"
                        >
                            <Search className="w-5 h-5" />
                            Search for Matching Donor
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPatient;
