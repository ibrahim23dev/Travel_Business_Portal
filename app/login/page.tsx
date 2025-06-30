'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '../features/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - replace with actual API call
    if (email && password) {
      dispatch(login({ id: '1', email }));
      router.push('/search');
    } else {
      setError('Please enter valid credentials');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto py-12 max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-sm">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Login</h1>
          {error && <p className="text-red-500 text-center mb-6">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}