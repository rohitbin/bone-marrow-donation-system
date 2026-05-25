import React from 'react';
import { Link } from 'react-router-dom';
import { Info, Activity, Heart, ShieldCheck, HelpCircle, ArrowRightCircle } from 'lucide-react';

const HowItWorks = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-xl p-8 sm:p-12 border border-gray-200 shadow-sm">
                <div className="text-center mb-16">
                     <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity className="text-blue-600 w-8 h-8" />
                     </div>
                     <h2 className="text-3xl font-bold text-gray-900 mb-4">How HLA Matching Works</h2>
                     <p className="text-gray-600 max-w-lg mx-auto">Understanding the genetic blueprint that saves lives.</p>
                </div>

                <div className="space-y-12">
                    <section className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-blue-50 p-4 rounded-lg flex-shrink-0 border border-blue-100">
                             <HelpCircle className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">What is HLA?</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Human Leukocyte Antigens (HLA) are proteins (markers) found on most cells in your body. Your immune system uses these markers to recognize which cells belong in your body and which do not.
                                A close HLA match between a donor and a patient is critical for a successful bone marrow transplant.
                            </p>
                        </div>
                    </section>

                    <section className="flex flex-col md:flex-row gap-8 items-start">
                         <div className="bg-blue-50 p-4 rounded-lg flex-shrink-0 border border-blue-100">
                             <Activity className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">The 10-Allele Match</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                We focus on 5 specific HLA markers, and because you inherit one set from each parent, there are 10 alleles total (2 at each locus):
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {['HLA-A', 'HLA-B', 'HLA-C', 'HLA-DRB1', 'HLA-DQB1'].map(l => (
                                    <div key={l} className="bg-gray-50 p-3 rounded-md border border-gray-200 text-center font-semibold text-gray-700 text-sm">{l}</div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col md:flex-row gap-8 items-start">
                         <div className="bg-blue-50 p-4 rounded-lg flex-shrink-0 border border-blue-100">
                             <ShieldCheck className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Why Matching Matters</h3>
                            <p className="text-gray-600 leading-relaxed">
                                When HLAs don't match closely, the body's immune system might attack the new donor marrow, leading to a dangerous condition called <span className="font-semibold text-red-600">Graft-versus-Host Disease (GVHD)</span>.
                                A 10/10 match is considered the standard for best patient outcomes.
                            </p>
                        </div>
                    </section>

                    <section className="bg-slate-900 p-8 sm:p-10 rounded-xl text-white mt-12">
                         <div className="flex items-center gap-3 mb-4">
                            <Heart className="text-blue-400 w-5 h-5" />
                            <h3 className="text-xl font-bold">Register Today</h3>
                         </div>
                         <p className="text-slate-300 mb-8 leading-relaxed max-w-2xl">
                             Every registration is a potential life saved. The HLA typing you provide today could be the exact match someone is searching for tomorrow.
                         </p>
                         <div>
                            <Link to="/register-donor" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-flex items-center gap-2 transition-colors">
                                 <ArrowRightCircle className="w-5 h-5" />
                                 Join the Registry
                            </Link>
                         </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
