
import { expect, test, describe, vi, beforeEach, type Mock } from 'vitest';
import { proxy } from '@/proxy';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import type { JWTPayload } from 'jose';

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

// Mock NextResponse
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>();
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      redirect: vi.fn((url) => ({ type: 'redirect', url: url.toString() })),
      next: vi.fn(() => ({ type: 'next' })),
    },
  };
});

describe('Proxy (Middleware)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should allow access to public routes', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/'));
    await proxy(req);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  test('should redirect unauthenticated users accessing /checkout', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/checkout'));
    await proxy(req);
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as unknown as Mock).mock.calls[0][0];
    expect(redirectUrl.toString()).toContain('/login');
    expect(redirectUrl.toString()).toContain('returnUrl=%2Fcheckout');
  });

  test('should redirect users with invalid token accessing /checkout', async () => {
    vi.mocked(verifyToken).mockResolvedValue(null);
    const req = new NextRequest(new URL('http://localhost:3000/checkout'));
    req.cookies.set('auth-token', 'invalid-token');
    
    await proxy(req);
    
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as unknown as Mock).mock.calls[0][0];
    expect(redirectUrl.toString()).toContain('/login');
  });

  test('should allow authenticated users accessing /checkout', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ 
      userId: '123', 
      role: 'user',
      // Add other required payload properties if necessary
    } as JWTPayload);
    const req = new NextRequest(new URL('http://localhost:3000/checkout'));
    req.cookies.set('auth-token', 'valid-token');
    
    await proxy(req);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });

  test('should redirect non-admin users accessing /admin', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ 
      userId: '123', 
      role: 'user' 
    } as JWTPayload);
    const req = new NextRequest(new URL('http://localhost:3000/admin/dashboard'));
    req.cookies.set('auth-token', 'valid-token');
    
    await proxy(req);
    
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as unknown as Mock).mock.calls[0][0];
    expect(redirectUrl.toString()).toBe('http://localhost:3000/');
  });

  test('should allow admin users accessing /admin', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ 
      userId: '123', 
      role: 'admin' 
    } as JWTPayload);
    const req = new NextRequest(new URL('http://localhost:3000/admin/dashboard'));
    req.cookies.set('auth-token', 'valid-token');
    
    await proxy(req);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
