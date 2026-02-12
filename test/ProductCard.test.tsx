import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductCard from '../src/components/ProductCard'

// Mock useCart hook
const mockAddToCart = vi.fn()

vi.mock('../src/context/CartContext', async () => {
  const actual = await vi.importActual('../src/context/CartContext')
  return {
    ...actual,
    useCart: () => ({
      addToCart: mockAddToCart,
    }),
  }
})

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: 'A great product',
    category: { id: 1, name: 'Electronics', image: '' },
    images: ['https://example.com/image.jpg'],
  }

  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('renders product price formatted', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('renders product category', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('renders link to product detail page', () => {
    render(<ProductCard product={mockProduct} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/product/1')
  })

  it('adds product to cart when Add button is clicked', () => {
    render(<ProductCard product={mockProduct} />)
    
    // Find add button by inner text or icon. 
    // Button has text "Add"
    const addButton = screen.getByRole('button', { name: /add/i })
    fireEvent.click(addButton)

    expect(mockAddToCart).toHaveBeenCalledTimes(1)
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  describe('Image Parsing Logic', () => {
    it('renders fallback image when images array is empty', () => {
      const productWithNoImages = { ...mockProduct, images: [] }
      render(<ProductCard product={productWithNoImages} />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', 'https://placehold.co/600x400')
    })

    it('handles malformed JSON string that is actually a valid URL inside', () => {
        // e.g. '["https://example.com/image.jpg"]' as a string in the array
        const product = {
          ...mockProduct,
          images: ['["https://example.com/image.jpg"]'],
        }
        render(<ProductCard product={product} />)
        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('handles clean JSON string array with multiple images', () => {
        const product = {
          ...mockProduct,
          images: ['["https://example.com/1.jpg", "https://example.com/2.jpg"]'],
        }
        render(<ProductCard product={product} />)
        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('src', 'https://example.com/1.jpg')
    })

    it('handles double quotes around URL', () => {
        const product = {
          ...mockProduct,
          images: ['"https://example.com/image.jpg"'],
        }
        render(<ProductCard product={product} />)
        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('handles JSON parse error gracefully', () => {
        // This simulates a broken JSON string that doesn't parse, so it falls through to retry logic
        // If it starts with http after cleaning quotes, it uses it. If not, fallback.
        const product = {
          ...mockProduct,
          images: ['["invalid-json'], // Missing closing bracket
        }
        render(<ProductCard product={product} />)
        const image = screen.getByRole('img')
        // "[\"invalid-json" cleaned is "[\"invalid-json", not starting with http -> fallback
        expect(image).toHaveAttribute('src', 'https://placehold.co/600x400')
    })

    it('uses fallback if resolved image is not a valid http url', () => {
        const product = {
          ...mockProduct,
          images: ['not-a-valid-url'],
        }
        render(<ProductCard product={product} />)
        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('src', 'https://placehold.co/600x400')
    })
  })
})
