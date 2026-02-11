import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductCard from '../src/components/ProductCard'
import { CartProvider } from '../src/context/CartContext'

// Wrapper untuk menyediakan CartProvider
const renderWithCart = (ui: React.ReactElement) => {
  return render(<CartProvider>{ui}</CartProvider>)
}

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
    renderWithCart(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('renders product price formatted', () => {
    renderWithCart(<ProductCard product={mockProduct} />)
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('renders product category', () => {
    renderWithCart(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('renders link to product detail page', () => {
    renderWithCart(<ProductCard product={mockProduct} />)
    const links = screen.getAllByRole('link')
    // ProductCard has multiple links, check the main one
    expect(links[0]).toHaveAttribute('href', '/product/1')
  })

  it('renders fallback image when images array is empty', () => {
    const productWithNoImages = { ...mockProduct, images: [] }
    renderWithCart(<ProductCard product={productWithNoImages} />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', 'https://placehold.co/600x400')
  })

  it('handles malformed image URLs', () => {
    const productWithBadImage = {
      ...mockProduct,
      images: ['["https://example.com/image.jpg"]'],
    }
    renderWithCart(<ProductCard product={productWithBadImage} />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })
})
