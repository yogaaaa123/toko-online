import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthProvider, useAuth } from '../../src/context/AuthContext'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => ({ get: vi.fn() }),
}))

// Test component
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <span data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </span>
      {user && (
        <div>
          <span data-testid="user-email">{user.email}</span>
          <span data-testid="user-name">{user.name}</span>
          <span data-testid="user-role">{user.role}</span>
        </div>
      )}
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('🔐 AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Reset fetch mock
    global.fetch = vi.fn()
  })

  it('starts with not authenticated state', async () => {
    // Mock the /api/auth/me endpoint to return not authenticated
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: false }),
    } as Response)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
  })

  it('loads authenticated user on mount', async () => {
    const mockUser = {
      id: 1,
      email: 'user@example.com',
      name: 'Test User',
      role: 'admin',
      avatar: 'https://example.com/avatar.jpg',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: true, user: mockUser }),
    } as Response)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    expect(screen.getByTestId('user-role')).toHaveTextContent('admin')
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      avatar: '',
    }

    // Initial check auth
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: false }),
    } as Response)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Mock successful login
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    } as Response)

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    })

    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
  })

  it('handles failed login', async () => {
    const user = userEvent.setup()

    // Initial check auth
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: false }),
    } as Response)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Mock failed login
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    } as Response)

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
    })
  })

  it('handles logout', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: 1,
      email: 'user@example.com',
      name: 'Test User',
      role: 'user',
      avatar: '',
    }

    // Initial check auth - user is logged in
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: true, user: mockUser }),
    } as Response)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    })

    // Mock logout
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response)

    await user.click(screen.getByText('Logout'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
    })

    // Should redirect to login page
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('handles network error during login', async () => {
    const user = userEvent.setup()

    // Initial check auth
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: false }),
    } as Response)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Mock network error
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

    await user.click(screen.getByText('Login'))

    // Should remain not authenticated
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
    })
  })

  it('handles network error during checkAuth', async () => {
    // Mock network error on initial check
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Should finish loading and be not authenticated (graceful failure)
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated')
  })

  it('handles network error during logout', async () => {
      const user = userEvent.setup()
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        role: 'user',
        avatar: '',
      }
  
      // Initial check auth - user is logged in
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ isAuthenticated: true, user: mockUser }),
      } as Response)
  
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
  
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
      })
  
      // Mock logout network error
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))
  
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      await user.click(screen.getByText('Logout'))
  
      // Even if API fails, client side should clear auth?
      // Looking at code: 
      // catch (error) { console.error('Logout error:', error); }
      // It DOES NOT clear user if fetch fails.
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
  })

  it('throws error when useAuth is used outside AuthProvider', () => {
    // We need to suppress console.error for this test as React logs the error boundary
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })
})
