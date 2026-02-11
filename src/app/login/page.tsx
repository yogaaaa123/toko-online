'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import Link from 'next/link';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  // Show loading while checking auth or redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      // Redirect admin to dashboard, regular users to returnUrl (or home)
      if (result.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push(returnUrl);
      }
    } else {
      setError(result.error || 'Login gagal');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Masuk ke akun Anda</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Gunakan kredensial dari Platzi Fake Store API
          </p>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-bold text-sm text-gray-900 mb-3">Demo Login:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-2 rounded border border-blue-100">
                <p className="font-bold text-blue-600">👑 Admin:</p>
                <p className="text-gray-900 font-medium">Email: <span className="font-mono">admin@mail.com</span></p>
                <p className="text-gray-900 font-medium">Password: <span className="font-mono">admin123</span></p>
              </div>
              <div className="bg-white p-2 rounded border border-green-100">
                <p className="font-bold text-green-600">👤 User (Platzi API):</p>
                <p className="text-gray-900 font-medium">Email: <span className="font-mono">john@mail.com</span> / <span className="font-mono">maria@mail.com</span></p>
                <p className="text-gray-900 font-medium">Password: <span className="font-mono">changeme</span> / <span className="font-mono">12345</span></p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-gray-900 mb-1">
                Email
              </label>
              <input
                id="username"
                name="email"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-medium"
                placeholder="admin@mail.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-1">Kata Sandi</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-medium"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
