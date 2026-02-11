import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
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
  
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
      <button onClick={() => addToCart(testProduct)}>Add</button>
      <button onClick={() => removeFromCart(1)}>Remove</button>
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
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockClear()
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

  it('removes item from cart', async () => {
    const user = userEvent.setup()
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Add'))
    await user.click(screen.getByText('Remove'))
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('1')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Product x 1')
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
})
