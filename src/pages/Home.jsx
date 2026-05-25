import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, UserPlus, Search, ShieldCheck, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
      <Icon className="text-blue-600 w-5 h-5" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-blue-700 text-sm font-medium">1,245+ Lives Saved This Year</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Connect, Donate & Save Lives
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Find the perfect life-saving donor match safely and securely. Our HLA typing system ensures precision matching for patients.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register-donor" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors">
              <UserPlus className="w-5 h-5" />
              Register as Donor
            </Link>
            <Link to="/register-patient" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors">
              <Search className="w-5 h-5" />
              Find a Donor
            </Link>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"
            alt="Medical Professional"
            className="rounded-xl shadow-lg w-full h-[400px] object-cover"
          />
        </div>
      </section>

      {/* Feature Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">A Modern Solution for Critical Matching</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Providing high-precision HLA analysis to connect donors and patients worldwide.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="Fast Matching"
            description="Our system processes HLA markers quickly, providing compatibility percentages for registered patients."
          />
          <FeatureCard
            icon={Heart}
            title="Life Saving"
            description="Bone marrow transplants are crucial for treating leukemia, lymphoma, and other blood-related diseases."
          />
          <FeatureCard
            icon={Activity}
            title="HLA Precision"
            description="Comparing 10 separate alleles (HLA-A, B, C, DRB1, DQB1) to ensure the highest transplant success rate."
          />
        </div>
      </section>

      {/* How it Works Simplified */}
      <section className="bg-slate-900 rounded-xl p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">How HLA Matching Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Donor HLAs are Typed</h4>
                  <p className="text-slate-300 text-sm">Genetic markers from blood samples are analyzed to determine the 10 core alleles.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Patient Profile Created</h4>
                  <p className="text-slate-300 text-sm">Patient profiles specify their HLA typing and urgency level for the match search.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Algorithmic Search</h4>
                  <p className="text-slate-300 text-sm">The system compares profiles. A 10/10 match is the gold standard for successful transplantation.</p>
                </div>
              </div>
            </div>
            <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Learn More About Matching Logic
              <Activity className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden lg:block bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Match Probability</span>
                <span className="text-green-400 font-medium">100% (10/10)</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-green-400 w-full h-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">HLA-A</span>
                  <span className="text-white font-mono text-sm">02:01, 03:01</span>
                </div>
                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">HLA-B</span>
                  <span className="text-white font-mono text-sm">07:02, 15:01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
