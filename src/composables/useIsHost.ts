import { ref, watch } from 'vue'
import { useAuth } from '@clerk/vue'
import type { HostProfile } from '@/types/host'
import { getHostProfile } from '@/api/host'
import { isApiConfigured } from '@/api/client'
import { isClerkConfigured } from '@/lib/clerk'

const isHost = ref(false)
const hostProfile = ref<HostProfile | null>(null)
const hostChecked = ref(false)
const hostLoading = ref(false)

let watcherStarted = false

function startHostWatcher(): void {
  if (watcherStarted || !isClerkConfigured()) return
  watcherStarted = true

  const { isSignedIn, isLoaded } = useAuth()

  watch(
    [isLoaded, isSignedIn],
    async ([loaded, signedIn]) => {
      if (!loaded) return

      if (!signedIn || !isApiConfigured()) {
        isHost.value = false
        hostProfile.value = null
        hostChecked.value = true
        return
      }

      hostLoading.value = true
      try {
        hostProfile.value = await getHostProfile()
        isHost.value = Boolean(hostProfile.value)
      } catch {
        isHost.value = false
        hostProfile.value = null
      } finally {
        hostLoading.value = false
        hostChecked.value = true
      }
    },
    { immediate: true },
  )
}

export async function refreshHostStatus(): Promise<void> {
  if (!isClerkConfigured() || !isApiConfigured()) return
  hostLoading.value = true
  try {
    hostProfile.value = await getHostProfile()
    isHost.value = Boolean(hostProfile.value)
  } catch {
    isHost.value = false
    hostProfile.value = null
  } finally {
    hostLoading.value = false
    hostChecked.value = true
  }
}

export function useIsHost() {
  startHostWatcher()
  return { isHost, hostProfile, hostChecked, hostLoading, refreshHostStatus }
}
