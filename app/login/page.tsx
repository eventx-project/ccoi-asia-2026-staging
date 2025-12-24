"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.trim() === 'CCOI2026') {
      localStorage.setItem('ccoi_access', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid Access Code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-teal-gradient">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">CCOI Asia 2026</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            aria-label="Access Code"
            placeholder="Enter Access Code"
            className="w-full border border-gray-200 p-3 rounded mb-3"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
          />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#2E5B8D] hover:bg-[#1E5A96] text-white p-3 rounded font-semibold"
          >
            Enter Event
          </button>
        </form>
      </div>
    </div>
  );
}
