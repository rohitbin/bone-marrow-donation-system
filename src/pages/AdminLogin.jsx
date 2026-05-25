import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
const AdminLogin = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, id, password);
            navigate('/hospital-dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid Credentials. Please check your email and password.');
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Hospital Login</h2>
                
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Email</label>
                        <input 
                            required
                            type="email" 
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                            placeholder="Enter ID"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            required
                            type="password" 
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {error && (
                        <p className="text-red-500 text-sm text-center py-1">
                            {error}
                        </p>
                    )}
                    
                    <button 
                        type="submit" 
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-lg transition-colors mt-2"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
