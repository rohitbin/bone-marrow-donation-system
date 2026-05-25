import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Activity, 
  UserPlus, 
  Search, 
  ChevronRight, 
  PlusCircle, 
  ClipboardList,
  LogOut,
  Hospital,
  Heart,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const HLA_LOCI = ['A', 'B', 'C', 'DRB1', 'DQB1'];

const HospitalDashboard = () => {
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [donors, setDonors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate('/admin'); // redirects to login page
                return;
            }

            try {
                // Fetch Hospital Data
                const hospitalRef = doc(db, 'hospitals', user.uid);
                const hospitalSnap = await getDoc(hospitalRef);
                
                if (hospitalSnap.exists()) {
                    const currentHosp = { id: hospitalSnap.id, ...hospitalSnap.data() };
                    setHospital(currentHosp);

                    // Fetch Donors & Patients registered by this hospital
                    const donorsQ = query(collection(db, 'donors'), where("hospitalId", "==", currentHosp.id));
                    const donorsSnap = await getDocs(donorsQ);
                    const localDonors = donorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setDonors(localDonors);
                    
                    const patientsQ = query(collection(db, 'patients'), where("hospitalId", "==", currentHosp.id));
                    const patientsSnap = await getDocs(patientsQ);
                    const localPatients = patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setPatients(localPatients);

                    // Fetch all donors from the database for global match calculations
                    const allDonorsSnap = await getDocs(collection(db, 'donors'));
                    const allDonors = allDonorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    // Build dynamic hospital activities list
                    const activitiesList = [];

                    // 1. Add donor registrations
                    localDonors.forEach(donor => {
                        activitiesList.push({
                            id: `donor-${donor.id}`,
                            type: 'donor_registration',
                            title: 'New Donor Registered',
                            description: `${donor.fullName} (${donor.age}Y, ${donor.gender}) was registered as a potential donor.`,
                            date: donor.createdAt ? new Date(donor.createdAt) : new Date(),
                            link: '#'
                        });
                    });

                    // 2. Add patient registrations and calculate match occurrences
                    localPatients.forEach(patient => {
                        activitiesList.push({
                            id: `patient-${patient.id}`,
                            type: 'patient_registration',
                            title: 'New Patient Registered',
                            description: `HLA matching search initiated for ${patient.patientName} (${patient.disease}, ${patient.bloodGroup}).`,
                            date: patient.createdAt ? new Date(patient.createdAt) : new Date(),
                            link: `/results/${patient.id}`
                        });

                        // Calculate matching scores with all available donors in registry
                        allDonors.forEach(donor => {
                            let matchCount = 0;
                            HLA_LOCI.forEach(locus => {
                                const pValues = [...(patient.hla?.[locus] || [])].sort();
                                const dValues = [...(donor.hla?.[locus] || ['', ''])].sort();
                                
                                if (dValues[0] && dValues[0] === pValues[0]) matchCount++;
                                if (dValues[1] && dValues[1] === pValues[1]) matchCount++;
                            });
                            
                            const percentage = (matchCount / 10) * 100;
                            if (percentage >= 50) {
                                activitiesList.push({
                                    id: `match-${patient.id}-${donor.id}`,
                                    type: 'match_found',
                                    title: `${percentage}% HLA Match Found`,
                                    description: `Patient ${patient.patientName} has high compatibility with registry donor ${donor.fullName} (${donor.bloodGroup}).`,
                                    date: patient.createdAt ? new Date(patient.createdAt) : new Date(),
                                    link: `/results/${patient.id}`
                                });
                            }
                        });
                    });

                    // Sort activity feed by date (newest first)
                    activitiesList.sort((a, b) => b.date - a.date);
                    setActivities(activitiesList);
                } else {
                    console.error("Hospital document not found!");
                }
            } catch (err) {
                console.error("Error fetching hospital data: ", err);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (!hospital) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-5">
                    <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                        <Hospital className="text-blue-700 w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{hospital.hospitalName}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">{hospital.type}</span>
                            <span>ID: {hospital.id}</span>
                            <span>{hospital.city}</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Registered Donors</p>
                        <p className="text-3xl font-bold text-gray-900">{donors.length}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <Users className="text-green-600 w-6 h-6" />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Registered Patients</p>
                        <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <Activity className="text-red-600 w-6 h-6" />
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg shadow-sm flex flex-col justify-between">
                    <div>
                         <h4 className="text-lg font-bold text-white mb-2">Network Database</h4>
                         <p className="text-slate-300 text-sm">Access the global registry for HLA matching beyond hospital borders.</p>
                    </div>
                    <Link to="/admin-dashboard" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors mt-4">
                        Global Registry Explorer
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Actions: Register as Donor/Recipient */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-blue-100">
                        <UserPlus className="text-blue-600 w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Register New Donor</h3>
                    <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                        Onboard a volunteer donor. Their HLA profile will be accessible to patients across the entire network.
                    </p>
                    <Link 
                        to="/register-donor" 
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium transition-colors"
                    >
                        <PlusCircle className="w-5 h-5 text-gray-500" />
                        Add Hospital Donor
                    </Link>
                </div>

                <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                     <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-red-100">
                        <Search className="text-red-600 w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Register New Patient</h3>
                    <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                        Onboard a recipient in need of marrow. Automatically trigger a high-precision HLA match search.
                    </p>
                    <Link 
                        to="/register-patient" 
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium transition-colors"
                    >
                        <PlusCircle className="w-5 h-5 text-white/80" />
                        Add Hospital Recipient
                    </Link>
                </div>
            </div>

            {/* List Section */}
            <div className="mt-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <ClipboardList className="text-gray-500 w-5 h-5" />
                     Recent Hospital Activity
                 </h3>
                 
                 {activities.length > 0 ? (
                     <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                         <div className="divide-y divide-gray-100">
                             {activities.map((activity) => (
                                 <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                                     <div className={`p-2.5 rounded-lg flex-shrink-0 border ${
                                         activity.type === 'match_found' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                         activity.type === 'patient_registration' ? 'bg-red-50 border-red-100 text-red-600' :
                                         'bg-green-50 border-green-100 text-green-600'
                                     }`}>
                                         {activity.type === 'match_found' && <Heart className="w-5 h-5 fill-indigo-600/10" />}
                                         {activity.type === 'patient_registration' && <Activity className="w-5 h-5" />}
                                         {activity.type === 'donor_registration' && <UserPlus className="w-5 h-5" />}
                                     </div>
                                     
                                     <div className="flex-grow min-w-0">
                                         <div className="flex items-center justify-between gap-4 flex-wrap">
                                             <h4 className="text-sm font-bold text-gray-900">{activity.title}</h4>
                                             <span className="text-xs text-gray-400 flex items-center gap-1">
                                                 <Calendar className="w-3.5 h-3.5" />
                                                 {activity.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                             </span>
                                         </div>
                                         <p className="text-sm text-gray-600 mt-1 leading-relaxed">{activity.description}</p>
                                         
                                         {activity.link !== '#' && (
                                             <div className="mt-3">
                                                 <Link 
                                                     to={activity.link} 
                                                     className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                                 >
                                                     {activity.type === 'match_found' ? 'View Match Details' : 'View Patient Results'}
                                                     <ArrowRight className="w-3.5 h-3.5" />
                                                 </Link>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 ) : (
                     <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
                         <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                         <h4 className="text-lg font-bold text-gray-600">No Activity Yet</h4>
                         <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">
                             Register donors and patients to see HLA matches and hospital history appear here.
                         </p>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default HospitalDashboard;
