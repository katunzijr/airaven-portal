import { ref } from 'vue'
import { useAuth } from '@clerk/vue'
import { fetchWishlist, toggleWishlist } from '@/api/wishlist'

const wishlistIds = ref<Set<string>>(new Set())
const wishlistLoaded = ref(false)
const wishlistLoading = ref(false)

export function useWishlist() {
  const { isSignedIn, isLoaded } = useAuth()

  async function refreshWishlist(): Promise<void> {
    if (!isLoaded.value || !isSignedIn.value) {
      wishlistIds.value = new Set()
      wishlistLoaded.value = true
      return
    }

    wishlistLoading.value = true
    try {
      const properties = await fetchWishlist()
      wishlistIds.value = new Set(properties.map((p) => p.id))
    } catch {
      wishlistIds.value = new Set()
    } finally {
      wishlistLoading.value = false
      wishlistLoaded.value = true
    }
  }

  function isSaved(propertyId: string): boolean {
    return wishlistIds.value.has(propertyId)
  }

  async function toggle(propertyId: string): Promise<boolean> {
    const result = await toggleWishlist(propertyId)
    wishlistIds.value = new Set(result.wishlist)
    return result.saved
  }

  function setSaved(propertyId: string, saved: boolean): void {
    const next = new Set(wishlistIds.value)
    if (saved) next.add(propertyId)
    else next.delete(propertyId)
    wishlistIds.value = next
  }

  return {
    wishlistIds,
    wishlistLoaded,
    wishlistLoading,
    refreshWishlist,
    isSaved,
    toggle,
    setSaved,
  }
}
