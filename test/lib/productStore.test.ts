import { describe, it, expect, beforeEach } from 'vitest'
import {
  getLocalProducts,
  addLocalProduct,
  updateLocalProduct,
  removeLocalProduct,
} from '../../src/lib/productStore'
import type { Product } from '../../src/types'

describe('🔧 Product Store Utilities', () => {
  // Mock product data
  const mockProduct1: Product = {
    id: 1,
    title: 'Product 1',
    price: 10.99,
    description: 'Description 1',
    category: { id: 1, name: 'Category 1', image: '' },
    images: ['https://example.com/image1.jpg'],
  }

  const mockProduct2: Product = {
    id: 2,
    title: 'Product 2',
    price: 20.99,
    description: 'Description 2',
    category: { id: 2, name: 'Category 2', image: '' },
    images: ['https://example.com/image2.jpg'],
  }

  beforeEach(() => {
    // Clear the store before each test by removing all products
    const products = getLocalProducts()
    products.forEach(p => removeLocalProduct(p.id))
  })

  describe('getLocalProducts', () => {
    it('should return empty array initially', () => {
      const products = getLocalProducts()
      expect(products).toEqual([])
    })

    it('should return all added products', () => {
      addLocalProduct(mockProduct1)
      addLocalProduct(mockProduct2)

      const products = getLocalProducts()
      expect(products).toHaveLength(2)
      expect(products).toContainEqual(mockProduct1)
      expect(products).toContainEqual(mockProduct2)
    })
  })

  describe('addLocalProduct', () => {
    it('should add product to the store', () => {
      addLocalProduct(mockProduct1)

      const products = getLocalProducts()
      expect(products).toHaveLength(1)
      expect(products[0]).toEqual(mockProduct1)
    })

    it('should add new products at the beginning (unshift)', () => {
      addLocalProduct(mockProduct1)
      addLocalProduct(mockProduct2)

      const products = getLocalProducts()
      // Product 2 should be first (most recent)
      expect(products[0]).toEqual(mockProduct2)
      expect(products[1]).toEqual(mockProduct1)
    })

    it('should handle multiple products', () => {
      const products = Array.from({ length: 5 }, (_, i) => ({
        ...mockProduct1,
        id: i + 1,
        title: `Product ${i + 1}`,
      }))

      products.forEach(p => addLocalProduct(p))

      const storedProducts = getLocalProducts()
      expect(storedProducts).toHaveLength(5)
    })
  })

  describe('updateLocalProduct', () => {
    it('should update existing product', () => {
      addLocalProduct(mockProduct1)

      const updated = updateLocalProduct(1, { title: 'Updated Title', price: 15.99 })

      expect(updated).not.toBeNull()
      expect(updated?.title).toBe('Updated Title')
      expect(updated?.price).toBe(15.99)
      expect(updated?.id).toBe(1) // ID should remain the same
    })

    it('should return null for non-existent product', () => {
      const updated = updateLocalProduct(999, { title: 'Updated' })
      expect(updated).toBeNull()
    })

    it('should partially update product fields', () => {
      addLocalProduct(mockProduct1)

      const updated = updateLocalProduct(1, { price: 25.99 })

      expect(updated?.price).toBe(25.99)
      expect(updated?.title).toBe('Product 1') // Title unchanged
      expect(updated?.description).toBe('Description 1') // Description unchanged
    })

    it('should update the actual product in the store', () => {
      addLocalProduct(mockProduct1)
      updateLocalProduct(1, { title: 'Modified' })

      const products = getLocalProducts()
      expect(products[0].title).toBe('Modified')
    })
  })

  describe('removeLocalProduct', () => {
    it('should remove existing product', () => {
      addLocalProduct(mockProduct1)
      addLocalProduct(mockProduct2)

      const removed = removeLocalProduct(1)

      expect(removed).toBe(true)
      const products = getLocalProducts()
      expect(products).toHaveLength(1)
      expect(products[0]).toEqual(mockProduct2)
    })

    it('should return false for non-existent product', () => {
      const removed = removeLocalProduct(999)
      expect(removed).toBe(false)
    })

    it('should handle removing all products', () => {
      addLocalProduct(mockProduct1)
      addLocalProduct(mockProduct2)

      removeLocalProduct(1)
      removeLocalProduct(2)

      const products = getLocalProducts()
      expect(products).toHaveLength(0)
    })

    it('should not affect other products when removing one', () => {
      const product3: Product = {
        ...mockProduct1,
        id: 3,
        title: 'Product 3',
      }

      addLocalProduct(mockProduct1)
      addLocalProduct(mockProduct2)
      addLocalProduct(product3)

      removeLocalProduct(2) // Remove middle product

      const products = getLocalProducts()
      expect(products).toHaveLength(2)
      expect(products).toContainEqual(mockProduct1)
      expect(products).toContainEqual(product3)
      expect(products).not.toContainEqual(mockProduct2)
    })
  })

  describe('integration scenarios', () => {
    it('should handle add, update, remove workflow', () => {
      // Add
      addLocalProduct(mockProduct1)
      expect(getLocalProducts()).toHaveLength(1)

      // Update
      updateLocalProduct(1, { price: 99.99 })
      expect(getLocalProducts()[0].price).toBe(99.99)

      // Remove
      removeLocalProduct(1)
      expect(getLocalProducts()).toHaveLength(0)
    })

    it('should maintain data integrity across operations', () => {
      addLocalProduct(mockProduct1)
      addLocalProduct(mockProduct2)

      updateLocalProduct(1, { title: 'Updated Product 1' })
      removeLocalProduct(2)

      const products = getLocalProducts()
      expect(products).toHaveLength(1)
      expect(products[0].id).toBe(1)
      expect(products[0].title).toBe('Updated Product 1')
    })
  })
})
