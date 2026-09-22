import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CartProvider, useCart } from '../src/context/CartContext'

// Test component that uses the cart
const TestComponent = () => {
  const { items, addToCart, removeFromCart, clearCart, totalItems, totalPrice } = useCart()
  
  const testProduct = {
    id: 1,
    title: 'Test Product',
    price: 10.99,
    description: 'Test description',
    category: { id: 1, name: 'Test', image: '' },
    images: ['https://example.com/image.jpg'],
  }
  
  const product2 = { ...testProduct, id: 2, title: 'Product 2', price: 20.00 }

  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
      <button onClick={() => addToCart(testProduct)}>Add</button>
      <button onClick={() => addToCart(product2)}>Add P2</button>
      <button onClick={() => removeFromCart(1)}>Remove</button>
      <button onClick={() => removeFromCart(999)}>Remove Invalid</button>
      <button onClick={clearCart}>Clear</button>
      <ul>
        {items.map(item => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            {item.title} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  )
}

describe('CartContext', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockClear()
    vi.mocked(localStorage.removeItem).mockClear()
    consoleErrorSpy.mockClear()
  })

  afterEach(() => {
    // consoleErrorSpy.mockRestore()
  })

  it('starts with empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('0')
    expect(screen.getByTestId('total-price')).toHaveTextContent('0.00')
  })

  it('adds item to cart', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    await user.click(screen.getByText('Add'))
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('1')
    expect(screen.getByTestId('total-price')).toHaveTextContent('10.99')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product x 1')
  })

  it('increments quantity when adding same item', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Add'))
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('2')
    expect(screen.getByTestId('total-price')).toHaveTextContent('21.98')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product x 2')
  })

  it('removes item from cart (decrements quantity)', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Add')) // qty 2
    await user.click(screen.getByText('Remove')) // qty 1
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('1')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product x 1')
  })

  it('removes item completely when quantity is 1', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    await user.click(screen.getByText('Add')) // qty 1
    await user.click(screen.getByText('Remove')) // qty 0 -> removed
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('0')
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument()
  })

  it('clears cart', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Clear'))
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('0')
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument()
  })

  it('loads cart from localStorage', () => {
    const savedCart = [
      {
        id: 1,
        title: 'Saved Product',
        price: 25.00,
        description: 'Saved',
        category: { id: 1, name: 'Test', image: '' },
        images: [],
        quantity: 3,
      },
    ]
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(savedCart))
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('3')
    expect(screen.getByTestId('total-price')).toHaveTextContent('75.00')
  })

  it('handles corrupt data in localStorage gracefully', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('{"invalid": [')
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('0')
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(localStorage.removeItem).toHaveBeenCalledWith('cart')
  })

  it('does nothing when removing non-existent item', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Remove Invalid'))
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('1')
  })

  it('throws error when useCart is used outside of CartProvider', () => {
    const originalError = console.error
    console.error = vi.fn()

    try {
      expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider')
    } finally {
      console.error = originalError
    }
  })

  it('updates correct item when multiple items exist (map branch coverage)', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    // Add product 1 and product 2
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Add P2'))

    expect(screen.getByTestId('total-items')).toHaveTextContent('2')

    // Add product 1 again (should update P1, leave P2 alone)
    await user.click(screen.getByText('Add'))

    expect(screen.getByTestId('total-items')).toHaveTextContent('3')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product x 2')
    expect(screen.getByTestId('item-2')).toHaveTextContent('Product 2 x 1')
  })

  it('handles localStorage setItem error gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock setItem to throw error
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    // Add item - should not crash, but log error
    await user.click(screen.getByText('Add'))
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('1')
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save cart to localStorage:', expect.any(Error))
  })
})
