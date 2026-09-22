import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Check for hardcoded admin account
    if (email === 'admin@mail.com' && password === 'admin123') {
      const adminUser = {
        id: 999,
        email: 'admin@mail.com',
        name: 'Administrator',
        role: 'admin',
        avatar: '', // Use default fallback icon
      };

      // Generate JWT
      const token = await signToken(adminUser);

      // Set cookies
      const cookieStore = await cookies();
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      cookieStore.set('user-info', JSON.stringify(adminUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return NextResponse.json({ success: true, user: adminUser });
    }

    // Otherwise, proceed with Platzi API authentication
    const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const data = await response.json();
    const accessToken = data.access_token;

    // Get user profile from Platzi
    const profileResponse = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const user = await profileResponse.json();

    // Create our own JWT containing the user info + platzi token
    const tokenPayload = {
      ...user,
      platziToken: accessToken,
    };
    
    const token = await signToken(tokenPayload);

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true, // Secure: only server can read
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    // Store user info in a separate cookie (visible to client for UI)
    cookieStore.set('user-info', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    }), {
      httpOnly: false, // Client can read this for UI
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
