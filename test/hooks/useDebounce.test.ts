import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDebounce } from '../../src/hooks/useDebounce'

describe('🪝 useDebounce Hook', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    )

    expect(result.current).toBe('first')

    // Change value
    rerender({ value: 'second', delay: 500 })
    
    // Value should not change immediately
    expect(result.current).toBe('first')

    // Wait for debounce delay
    await waitFor(() => {
      expect(result.current).toBe('second')
    }, { timeout: 600 })
  })

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    )

    // Rapid changes
    rerender({ value: 'second' })
    rerender({ value: 'third' })
    rerender({ value: 'fourth' })

    // Should still be initial value
    expect(result.current).toBe('first')

    // After delay, should have the last value only
    await waitFor(() => {
      expect(result.current).toBe('fourth')
    }, { timeout: 400 })
  })

  it('should work with different data types', async () => {
    // Test with number
    const { result: numberResult } = renderHook(() => useDebounce(42, 100))
    expect(numberResult.current).toBe(42)

    // Test with object
    const testObj = { name: 'test', value: 123 }
    const { result: objResult } = renderHook(() => useDebounce(testObj, 100))
    expect(objResult.current).toEqual(testObj)

    // Test with array
    const testArray = [1, 2, 3]
    const { result: arrayResult } = renderHook(() => useDebounce(testArray, 100))
    expect(arrayResult.current).toEqual(testArray)
  })

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    
    const { unmount } = renderHook(() => useDebounce('value', 500))
    
    unmount()
    
    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })

  it('should update delay dynamically', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    )

    // Change value and delay
    rerender({ value: 'changed', delay: 100 })

    // Should use new delay (100ms instead of 1000ms)
    await waitFor(() => {
      expect(result.current).toBe('changed')
    }, { timeout: 200 })
  })
})
