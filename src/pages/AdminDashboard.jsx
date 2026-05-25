import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  ClipboardList,
  Activity,
  UserPlus,
  Hospital,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
  Stethoscope
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [donors, setDonors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [activeTab, setActiveTab] = useState('donors');
    const [searchTerm, setSearchTerm] = useState('');
    const [bloodFilter, setBloodFilter] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/admin');
            } else {
                fetchData();
            }
        });

        const fetchData = async () => {
            try {
                const donorsSnap = await getDocs(collection(db, 'donors'));
                setDonors(donorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                const patientsSnap = await getDocs(collection(db, 'patients'));
                setPatients(patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                const hospitalsSnap = await getDocs(collection(db, 'hospitals'));
                setHospitals(hospitalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error("Error fetching data: ", err);
            }
        };

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const deleteItem = async (id, type) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;

        try {
            await deleteDoc(doc(db, type, id));
            
            if (type === 'donors') setDonors(prev => prev.filter(item => item.id !== id));
            else if (type === 'patients') setPatients(prev => prev.filter(item => item.id !== id));
            else setHospitals(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Error deleting document: ", err);
            alert("Failed to delete record.");
        }
    };

    const filteredDonors = donors.filter(d => 
        ((d.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || d.bloodGroup.includes(searchTerm)) &&
        (bloodFilter === '' || d.bloodGroup === bloodFilter)
    );

    const filteredPatients = patients.filter(p => 
        ((p.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.hospital || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
        (bloodFilter === '' || p.bloodGroup === bloodFilter)
    );

    const filteredHospitals = hospitals.filter(h => 
        (h.hospitalName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (h.city || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const DetailsModal = ({ item, type, onClose }) => {
        if (!item) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 sm:p-6">
                <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-lg overflow-hidden shadow-xl flex flex-col">
                    <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            {type === 'hospitals' ? <Hospital className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                            <div>
                                <h3 className="text-xl font-bold">{item.fullName || item.patientName || item.hospitalName}</h3>
                                <p className="text-sm text-blue-100">Full Profile Details</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8">
                        {/* 1. Basic Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs text-gray-500 font-semibold uppercase">Record ID</label>
                                <div className="text-gray-900 font-medium">#{item.id}</div>
                            </div>
                            {type !== 'hospitals' && (
                                <>
                                    <div>
                                        <label className="text-xs text-gray-500 font-semibold uppercase">Blood Group</label>
                                        <div className="text-red-600 font-bold">{item.bloodGroup}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-semibold uppercase">Age / Gender</label>
                                        <div className="text-gray-900 font-medium">{item.age} Y / {item.gender || 'N/A'}</div>
                                    </div>
                                </>
                            )}
                            {type === 'hospitals' && (
                                <>
                                    <div>
                                        <label className="text-xs text-gray-500 font-semibold uppercase">Type</label>
                                        <div className="text-blue-600 font-medium">{item.type}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-semibold uppercase">License No.</label>
                                        <div className="text-gray-900 font-medium">{item.registrationNumber}</div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 2. Contact & Location */}
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                            <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b border-gray-200 pb-2">
                                <MapPin className="text-blue-600 w-5 h-5" />
                                Contact Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-700">{item.contact?.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-700">{item.contact?.phone || 'N/A'}</span>
                                </div>
                                {type === 'hospitals' && (
                                    <div className="md:col-span-2 flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-700">{item.address}, {item.city}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Specialized Data (HLA / Medical) */}
                        {type !== 'hospitals' && (
                            <>
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b border-gray-200 pb-2">
                                        <ShieldAlert className="text-blue-600 w-5 h-5" />
                                        Medical History & Screening
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        {type === 'donors' ? (
                                            <>
                                                <div className="flex justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                                                    <span className="text-sm font-medium text-gray-600">HIV Status</span>
                                                    <span className={item.medical?.hivStatus ? "text-green-600 font-medium text-sm" : "text-red-500 font-medium text-sm"}>
                                                        {item.medical?.hivStatus ? 'Negative' : 'Untested/Positive'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                                                    <span className="text-sm font-medium text-gray-600">Hepatitis Status</span>
                                                    <span className={item.medical?.hepatitisStatus ? "text-green-600 font-medium text-sm" : "text-red-500 font-medium text-sm"}>
                                                        {item.medical?.hepatitisStatus ? 'Negative' : 'Untested/Positive'}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                                                    <span className="text-sm font-medium text-gray-600">Condition</span>
                                                    <span className="text-red-600 font-bold text-sm">{item.disease}</span>
                                                </div>
                                                <div className="flex justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                                                    <span className="text-sm font-medium text-gray-600">Urgency</span>
                                                    <span className="text-blue-600 font-medium text-sm">{item.urgency}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b border-gray-200 pb-2">
                                        <Activity className="text-blue-600 w-5 h-5" />
                                        HLA Typing Profile (10-Alleles)
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                                        {Object.entries(item.hla || {}).map(([locus, vals]) => (
                                            <div key={locus} className="p-3 bg-white border border-gray-200 rounded text-center">
                                                <div className="text-xs font-bold text-gray-500 mb-1">HLA-{locus}</div>
                                                <div className="text-sm font-mono text-gray-800 space-y-1">
                                                    <div>{vals[0]}</div>
                                                    <div className="text-gray-300">|</div>
                                                    <div>{vals[1]}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {type === 'hospitals' && (
                             <div className="space-y-4">
                                <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b border-gray-200 pb-2">
                                    <Stethoscope className="text-blue-600 w-5 h-5" />
                                    Institutional Facilities
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    {Object.entries(item.facilities || {}).map(([key, val]) => (
                                        <div key={key} className={`p-4 rounded border text-center ${val ? "bg-blue-50 border-blue-200 text-blue-700 font-medium" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                                            <div className="text-xs uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</div>
                                            <div className="mt-2 text-lg">{val ? '✓' : '×'}</div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {selectedItem && (
                <DetailsModal 
                    item={selectedItem} 
                    type={activeTab} 
                    onClose={() => setSelectedItem(null)} 
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Registry Dashboard</h2>
                    <p className="text-sm text-gray-500">Manage donors, patients, hospitals, and view system statistics.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors text-sm"
                    >
                        Logout
                    </button>
                    <Link to="/register-donor" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 text-sm transition-colors">
                         <UserPlus className="w-4 h-4" />
                         Add Donor
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <Users className="text-blue-600 w-6 h-6 mb-3" />
                     <div className="text-2xl font-bold text-gray-900">{donors.length}</div>
                     <div className="text-sm text-gray-500 mt-1">Registered Donors</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <Activity className="text-red-600 w-6 h-6 mb-3" />
                     <div className="text-2xl font-bold text-gray-900">{patients.length}</div>
                     <div className="text-sm text-gray-500 mt-1">Total Patients</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <Hospital className="text-blue-600 w-6 h-6 mb-3" />
                     <div className="text-2xl font-bold text-gray-900">{hospitals.length}</div>
                     <div className="text-sm text-gray-500 mt-1">Registered Hospitals</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <ClipboardList className="text-gray-400 w-6 h-6 mb-3" />
                     <div className="text-2xl font-bold text-gray-900">84%</div>
                     <div className="text-sm text-gray-500 mt-1">Matching Efficiency</div>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-md overflow-x-auto">
                        <button 
                            onClick={() => setActiveTab('donors')}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === 'donors' ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Donors
                        </button>
                        <button 
                             onClick={() => setActiveTab('patients')}
                             className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === 'patients' ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Recipients
                        </button>
                        <button 
                             onClick={() => setActiveTab('hospitals')}
                             className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === 'hospitals' ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Hospitals
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {activeTab !== 'hospitals' && (
                            <select 
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={bloodFilter}
                                onChange={(e) => setBloodFilter(e.target.value)}
                            >
                                <option value="">All Blood</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID / Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {activeTab === 'donors' ? 'Age' : activeTab === 'patients' ? 'Disease' : 'Registration No.'}
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {activeTab === 'hospitals' ? 'Type' : 'Blood Type'}
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {activeTab === 'hospitals' ? 'City' : 'Organization'}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {(activeTab === 'donors' ? filteredDonors : activeTab === 'patients' ? filteredPatients : filteredHospitals).map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white ${
                                                activeTab === 'donors' ? "bg-blue-500" : activeTab === 'patients' ? "bg-red-500" : "bg-indigo-500"
                                            }`}>
                                                {(item.fullName || item.patientName || item.hospitalName)?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{item.fullName || item.patientName || item.hospitalName}</div>
                                                <div className="text-xs text-gray-500">#{item.id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">
                                            {activeTab === 'donors' ? `${item.age} Years` : activeTab === 'patients' ? item.disease : item.registrationNumber}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            activeTab === 'hospitals' ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-gray-100 text-gray-700 border-gray-200"
                                        }`}>
                                            {activeTab === 'hospitals' ? item.type : item.bloodGroup}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700 truncate max-w-[150px]">
                                            {activeTab === 'hospitals' ? item.city : (item.hospitalName || item.hospital)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => setSelectedItem(item)}
                                                className="p-1.5 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                                title="View Full Profile"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {activeTab === 'patients' && (
                                                <Link 
                                                    to={`/results/${item.id}`}
                                                    className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Match Search"
                                                >
                                                    <Search className="w-4 h-4" />
                                                </Link>
                                            )}
                                            <button 
                                                onClick={() => deleteItem(item.id, activeTab)}
                                                className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
