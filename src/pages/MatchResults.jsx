import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Activity, 
  User, 
  Heart, 
  FileText,
  Search,
  BrainCircuit,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const HLA_LOCI = ['A', 'B', 'C', 'DRB1', 'DQB1'];

const MatchResults = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientRef = doc(db, 'patients', patientId);
                const patientSnap = await getDoc(patientRef);

                if (!patientSnap.exists()) {
                    setLoading(false);
                    return;
                }

                const currentPatient = { id: patientSnap.id, ...patientSnap.data() };
                setPatient(currentPatient);
                
                const donorsSnapshot = await getDocs(collection(db, 'donors'));
                const donors = donorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Calculate matches & Simulated ML score
                const matchResults = donors.map(donor => {
                let matchCount = 0;
                let details = {};

                // 1. Biological HLA Matching
                HLA_LOCI.forEach(locus => {
                    const pValues = [...currentPatient.hla[locus]].sort();
                    const dValues = [...(donor.hla[locus] || ['', ''])].sort();
                    
                    let locusMatch = 0;
                    if (dValues[0] && dValues[0] === pValues[0]) locusMatch++;
                    if (dValues[1] && dValues[1] === pValues[1]) locusMatch++;
                    
                    matchCount += locusMatch;
                    details[locus] = {
                        patient: pValues,
                        donor: dValues,
                        score: locusMatch
                    };
                });

                const hlaPercentage = (matchCount / 10) * 100;
                let status = 'No Match';
                if (hlaPercentage === 100) status = '100% Match';
                else if (hlaPercentage >= 50) status = 'Partial Match';

                // 2. Simulated ML Predictor for Transplant Success & GVHD Risk
                let mlScore = hlaPercentage; // Base score is the HLA match
                let gvhdRisk = "Low";
                let mlFactors = [];

                if (hlaPercentage > 0) {
                    // Age Factor (Younger donors are better)
                    const donorAge = parseInt(donor.age) || 30;
                    if (donorAge < 30) {
                        mlScore += 5;
                        mlFactors.push("Optimal Donor Age (+)");
                    } else if (donorAge > 50) {
                        mlScore -= 10;
                        mlFactors.push("Advanced Donor Age (-)");
                        gvhdRisk = "Medium";
                    }

                    // Gender Factor (Female with possible prior pregnancies -> Male carries higher GVHD risk)
                    if (currentPatient.gender === 'Male' && donor.gender === 'Female') {
                        mlScore -= 5;
                        mlFactors.push("Gender Mismatch (F->M) (-)");
                        gvhdRisk = gvhdRisk === "Medium" ? "High" : "Medium";
                    } else if (currentPatient.gender === donor.gender) {
                        mlScore += 3;
                        mlFactors.push("Gender Matched (+)");
                    }

                    // Blood Type Factor
                    if (currentPatient.bloodGroup === donor.bloodGroup) {
                        mlScore += 2;
                        mlFactors.push("ABO Matched (+)");
                    } else {
                        mlScore -= 2;
                        mlFactors.push("ABO Mismatch (-)");
                    }

                    // Urgency Penalty (If patient is critical, overall success drops slightly due to health state)
                    if (currentPatient.urgency === 'Critical') {
                        mlScore -= 5;
                    }
                }

                // Cap the ML score between 0 and 99 (or 100 if perfectly optimal)
                mlScore = Math.max(0, Math.min(99, mlScore));
                if (hlaPercentage === 100 && mlScore > 95) mlScore = 98; // Realistic cap

                return {
                    donor,
                    score: matchCount,
                    percentage: hlaPercentage,
                    mlScore: Math.round(mlScore),
                    gvhdRisk,
                    mlFactors,
                    status,
                    details
                };
            }).sort((a, b) => b.mlScore - a.mlScore); // Sort by ML Smart Score instead of raw percentage

            setMatches(matchResults);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
            setLoading(false);
        };
        
        fetchData();
    }, [patientId]);

    if (loading) return <div className="flex justify-center items-center h-96"><Activity className="animate-spin text-blue-600 w-8 h-8" /></div>;
    if (!patient) return <div className="max-w-xl mx-auto mt-20 text-center bg-white p-10 rounded-lg shadow-sm border border-gray-200"><h2 className="text-2xl font-bold text-gray-900">Patient Not Found</h2><Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded mt-6 inline-block">Go Home</Link></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
                {/* Patient Summary Card */}
                <div className="w-full lg:w-1/3 bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200 self-start">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                            <Heart className="text-red-600 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{patient.patientName}</h2>
                            <p className="text-gray-500 text-sm">{patient.disease} • {patient.age || 'N/A'}Y / {patient.gender || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-500">Hospital</span>
                            <span className="text-gray-900 font-medium text-right">{patient.hospital}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-500">Ref Doctor</span>
                            <span className="text-gray-900 font-medium text-right">{patient.doctor}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-500">Blood Group</span>
                            <span className="text-red-600 font-bold">{patient.bloodGroup}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                            <span className="text-gray-500">Urgency</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                patient.urgency === 'Critical' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                            }`}>
                                {patient.urgency}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Patient HLA Typing</h4>
                         <div className="grid grid-cols-2 gap-3">
                            {HLA_LOCI.map(loc => (
                                <div key={loc} className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-500">HLA-{loc}</span>
                                    <span className="text-sm font-mono text-gray-800">{patient.hla[loc].join(', ')}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Match Results Feed */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                             <BrainCircuit className="text-indigo-600 w-6 h-6" />
                             ML Recommended Donors ({matches.length})
                        </h3>
                        {matches.length > 0 && <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Sorted by AI Prediction Score</span>}
                    </div>

                    {matches.map((match) => (
                        <div 
                            key={match.donor.id}
                            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative"
                        >
                            {/* ML Badge */}
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Smart Rank
                            </div>

                            <div className="p-6 sm:p-8">
                                <div className="flex flex-wrap items-start justify-between gap-6 mb-6 mt-2">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <User className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">{match.donor.fullName}</h4>
                                            <p className="text-sm text-gray-500"> Donor ID: #{match.donor.id.slice(-6)} • {match.donor.age}Y / {match.donor.gender} • {match.donor.bloodGroup}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500 font-medium">HLA Match</div>
                                                <div className="text-xl font-bold text-gray-900">{match.percentage}%</div>
                                            </div>
                                            <div className="h-10 w-px bg-gray-200"></div>
                                            <div className="text-right">
                                                <div className="text-sm text-indigo-600 font-bold flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> ML Success Prob.</div>
                                                <div className="text-3xl font-black text-indigo-700">{match.mlScore}%</div>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 border ${
                                            match.status === '100% Match' ? "bg-green-50 text-green-700 border-green-200" :
                                            match.status === 'Partial Match' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                            "bg-gray-50 text-gray-500 border-gray-200"
                                        }`}>
                                            {match.status === '100% Match' ? <CheckCircle2 className="w-4 h-4"/> : 
                                             match.status === 'Partial Match' ? <AlertTriangle className="w-4 h-4"/> : 
                                             <XCircle className="w-4 h-4"/>}
                                            {match.status}
                                        </div>
                                    </div>
                                </div>

                                {/* ML Insights Box */}
                                <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                    <h5 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4" /> AI Match Insights
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-indigo-600 mb-1">Key Factors Influencing Score:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {match.mlFactors.length > 0 ? match.mlFactors.map((factor, i) => (
                                                    <span key={i} className={`text-xs px-2 py-1 rounded border ${factor.includes('(+)') ? 'bg-white text-green-700 border-green-200' : 'bg-white text-red-600 border-red-200'}`}>
                                                        {factor.replace(' (+)', '').replace(' (-)', '')}
                                                    </span>
                                                )) : <span className="text-xs text-indigo-400">Standard Match (No modifiers)</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white p-3 rounded border border-indigo-100">
                                            <ShieldAlert className={`w-6 h-6 ${match.gvhdRisk === 'Low' ? 'text-green-500' : match.gvhdRisk === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`} />
                                            <div>
                                                <div className="text-xs text-gray-500">Predicted GVHD Risk</div>
                                                <div className={`text-sm font-bold ${match.gvhdRisk === 'Low' ? 'text-green-700' : match.gvhdRisk === 'Medium' ? 'text-yellow-700' : 'text-red-700'}`}>
                                                    {match.gvhdRisk} Risk
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Table */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wider">Locus</th>
                                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wider">Patient Alleles</th>
                                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wider">Donor Alleles</th>
                                                <th className="px-4 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wider text-center">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {HLA_LOCI.map(locus => {
                                                const details = match.details[locus];
                                                return (
                                                    <tr key={locus} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 font-bold text-gray-800">HLA-{locus}</td>
                                                        <td className="px-4 py-3 font-mono text-gray-600">{details.patient.join(', ')}</td>
                                                        <td className="px-4 py-3 font-mono">
                                                            <div className="flex gap-1 flex-wrap">
                                                                {details.donor.map((val, i) => (
                                                                    <span key={i} className={`px-1.5 py-0.5 rounded ${
                                                                        details.patient.includes(val) ? "bg-green-100 text-green-800 font-semibold" : "text-gray-500"
                                                                    }`}>
                                                                        {val}{i === 0 ? ',' : ''}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold ${
                                                                details.score === 2 ? "bg-green-100 text-green-800" :
                                                                details.score === 1 ? "bg-yellow-100 text-yellow-800" :
                                                                "bg-gray-100 text-gray-500"
                                                            }`}>
                                                                {details.score}/2
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm py-2 px-4 rounded-md font-medium flex items-center gap-2 transition-colors">
                                        <FileText className="w-4 h-4" />
                                        Download Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {matches.length === 0 && (
                        <div className="bg-white p-12 sm:p-20 rounded-lg text-center border border-gray-200 shadow-sm">
                            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-gray-600">No Potential Donors Yet</h4>
                            <p className="text-gray-500 mt-2 text-sm">Try adding some donors to the registry first.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchResults;
