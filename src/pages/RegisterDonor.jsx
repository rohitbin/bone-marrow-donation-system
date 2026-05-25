import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Save, User, Activity, ClipboardList } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

const HLA_LOCI = ['A', 'B', 'C', 'DRB1', 'DQB1'];

const RegisterDonor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        age: '',
        gender: '',
        bloodGroup: '',
        height: '',
        weight: '',
        contact: {
            phone: '',
            email: ''
        },
        hla: {
            A: ['', ''],
            B: ['', ''],
            C: ['', ''],
            DRB1: ['', ''],
            DQB1: ['', ''],
            DPB1: ['', '']
        },
        medical: {
            diseases: [],
            hivStatus: false,
            hepatitisStatus: false,
            smoking: false,
            alcohol: false,
        },
        consent: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { 
                    ...(prev[parent] || {}), 
                    [child]: value 
                }
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

    const handleMedicalChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            medical: { 
                ...(prev.medical || {}), 
                [name]: value 
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let hospitalId = null;
            let hospitalName = 'Independent';
            
            if (auth.currentUser) {
                hospitalId = auth.currentUser.uid;
                const hDoc = await getDoc(doc(db, 'hospitals', hospitalId));
                if(hDoc.exists()) {
                    hospitalName = hDoc.data().hospitalName;
                }
            }

            const newDonor = { 
                ...formData, 
                hospitalId,
                hospitalName,
                createdAt: new Date().toISOString()
            };
            
            await addDoc(collection(db, 'donors'), newDonor);
            
            alert('Donor Registration Successful!');
            if (hospitalId) navigate('/hospital-dashboard');
            else navigate('/admin');
        } catch (err) {
            console.error("Error saving donor:", err);
            alert("Failed to save donor data.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <UserPlus className="w-6 h-6" />
                        Donor Registration
                    </h2>
                    <p className="text-blue-100">Please provide accurate genetic information for the registry.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* 1. Basic Info */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <User className="text-blue-600 w-5 h-5" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="fullName" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="John Doe" 
                                        value={formData.fullName} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input 
                                            required 
                                            type="date" 
                                            name="dob" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            value={formData.dob} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input 
                                            required 
                                            type="number" 
                                            name="age" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="25" 
                                            value={formData.age} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
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
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Height (Feet.Inches)</label>
                                        <input 
                                            type="number" 
                                            step="any"
                                            name="height" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="e.g. 5.8" 
                                            value={formData.height} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                        <input 
                                            type="number" 
                                            name="weight" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="70" 
                                            value={formData.weight} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input 
                                        required 
                                        type="tel" 
                                        name="contact.phone" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="+1 234 567 890" 
                                        value={formData.contact.phone} 
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
                                        placeholder="email@example.com" 
                                        value={formData.contact.email} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 2. HLA Typing */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Activity className="text-blue-600 w-5 h-5" />
                                HLA Typing (Mandatory)
                            </h3>
                            <p className="text-sm text-gray-500">Please enter your HLA values precisely. For example: 02:01</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {HLA_LOCI.map(locus => (
                                    <div key={locus} className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm">
                                        <label className="block text-sm font-bold text-gray-800 mb-3">HLA-{locus}</label>
                                        <div className="flex gap-2">
                                            <input 
                                                required 
                                                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                placeholder="Val 1" 
                                                value={formData.hla[locus]?.[0] || ''} 
                                                onChange={(e) => handleHLAListChange(locus, 0, e.target.value)} 
                                            />
                                            <input 
                                                required 
                                                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                placeholder="Val 2" 
                                                value={formData.hla[locus]?.[1] || ''} 
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
                                            value={formData.hla.DPB1?.[0] || ''} 
                                            onChange={(e) => handleHLAListChange('DPB1', 0, e.target.value)} 
                                        />
                                        <input 
                                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="Val 2" 
                                            value={formData.hla.DPB1?.[1] || ''} 
                                            onChange={(e) => handleHLAListChange('DPB1', 1, e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Medical Info */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <ClipboardList className="text-blue-600 w-5 h-5" />
                                Medical Screening
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                            checked={formData.medical.hivStatus || false} 
                                            onChange={(e) => handleMedicalChange('hivStatus', e.target.checked)} 
                                        />
                                        <span className="text-sm font-medium text-gray-700">HIV Negative Status confirmed</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                            checked={formData.medical.hepatitisStatus || false} 
                                            onChange={(e) => handleMedicalChange('hepatitisStatus', e.target.checked)} 
                                        />
                                        <span className="text-sm font-medium text-gray-700">Hepatitis Negative Status confirmed</span>
                                    </label>
                                </div>
                                <div className="space-y-4">
                                     <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                            checked={formData.medical.smoking || false} 
                                            onChange={(e) => handleMedicalChange('smoking', e.target.checked)} 
                                        />
                                        <span className="text-sm font-medium text-gray-700">Non-Smoker</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                            checked={formData.medical.alcohol || false} 
                                            onChange={(e) => handleMedicalChange('alcohol', e.target.checked)} 
                                        />
                                        <span className="text-sm font-medium text-gray-700">Non-Alcoholic</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Consent */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                            <label className="flex gap-3 cursor-pointer">
                                <input 
                                    required 
                                    type="checkbox" 
                                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                    checked={formData.consent || false} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))} 
                                />
                                <span className="text-sm text-gray-700 leading-relaxed">
                                    I hereby confirm that the information provided is accurate and I voluntarily register as a potential bone marrow donor. I understand that matching may be required if a patient in need is identified.
                                </span>
                            </label>
                            
                            <button 
                                type="submit" 
                                disabled={!formData.consent}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <Save className="w-5 h-5" />
                                Confirm & Register as Donor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterDonor;
