<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { uploadListingImages } from '@/api/upload'
import { ImagePlus, Link2, Loader2, Plus, Star, Trash2, Upload } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [urls: string[]]
}>()

type Tab = 'upload' | 'urls'

const activeTab = ref<Tab>('upload')
const pendingFiles = ref<File[]>([])
const pendingPreviews = ref<string[]>([])
const uploading = ref(false)
const uploadError = ref('')
const dragOver = ref(false)
const uploadedUrls = ref<string[]>([...props.modelValue])
const coverUrl = ref(props.modelValue[0] ?? '')

watch(
  () => props.modelValue,
  (urls) => {
    if (pendingFiles.value.length) return
    const next = [...urls]
    if (!next.length) return
    const same =
      next.length === uploadedUrls.value.length &&
      next.every((url, i) => url === uploadedUrls.value[i])
    if (same) return
    uploadedUrls.value = next
    if (!coverUrl.value || !next.includes(coverUrl.value)) {
      coverUrl.value = next[0]
    }
  },
  { deep: true },
)

const urlInputs = ref<{ id: string; value: string }[]>([{ id: crypto.randomUUID(), value: '' }])

const manualUrls = computed(() =>
  urlInputs.value.map((r) => r.value.trim()).filter(Boolean),
)

const allImages = computed(() => {
  const merged = [...uploadedUrls.value, ...manualUrls.value]
  return [...new Set(merged)]
})

const orderedImages = computed(() => {
  if (!allImages.value.length) return []
  const cover = coverUrl.value && allImages.value.includes(coverUrl.value)
    ? coverUrl.value
    : allImages.value[0]
  return [cover, ...allImages.value.filter((url) => url !== cover)]
})

watch(orderedImages, (urls) => emit('update:modelValue', urls))

watch(allImages, (urls) => {
  if (!urls.length) {
    coverUrl.value = ''
    return
  }
  if (!coverUrl.value || !urls.includes(coverUrl.value)) {
    coverUrl.value = urls[0]
  }
})

function setCover(url: string): void {
  coverUrl.value = url
  emit('update:modelValue', orderedImages.value)
}

function addUrlInput(): void {
  urlInputs.value.push({ id: crypto.randomUUID(), value: '' })
}

function removeUrlInput(id: string): void {
  if (urlInputs.value.length === 1) {
    urlInputs.value[0].value = ''
    return
  }
  urlInputs.value = urlInputs.value.filter((row) => row.id !== id)
}

function addFiles(files: FileList | File[]): void {
  const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
  for (const file of list) {
    pendingFiles.value.push(file)
    pendingPreviews.value.push(URL.createObjectURL(file))
  }
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  if (input.files) addFiles(input.files)
  input.value = ''
}

function onDrop(event: DragEvent): void {
  dragOver.value = false
  if (event.dataTransfer?.files) addFiles(event.dataTransfer.files)
}

function removePending(index: number): void {
  URL.revokeObjectURL(pendingPreviews.value[index])
  pendingFiles.value.splice(index, 1)
  pendingPreviews.value.splice(index, 1)
}

function removeImage(url: string): void {
  uploadedUrls.value = uploadedUrls.value.filter((u) => u !== url)
  const row = urlInputs.value.find((r) => r.value.trim() === url)
  if (row) row.value = ''
  if (coverUrl.value === url) {
    coverUrl.value = allImages.value.find((u) => u !== url) ?? ''
  }
}

async function confirmUpload(): Promise<void> {
  if (!pendingFiles.value.length) return
  uploadError.value = ''
  uploading.value = true
  try {
    const urls = await uploadListingImages(pendingFiles.value)
    uploadedUrls.value = [...new Set([...uploadedUrls.value, ...urls])]
    if (!coverUrl.value && urls.length) coverUrl.value = urls[0]
    pendingPreviews.value.forEach((url) => URL.revokeObjectURL(url))
    pendingFiles.value = []
    pendingPreviews.value = []
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : 'Upload failed'
  } finally {
    uploading.value = false
  }
}

function syncUrlImages(): void {
  emit('update:modelValue', orderedImages.value)
}

function validate(): { ok: boolean; message?: string } {
  if (pendingFiles.value.length) {
    return { ok: false, message: 'Upload selected photos before continuing' }
  }
  if (!allImages.value.length) {
    return { ok: false, message: 'Add at least one photo' }
  }
  if (!coverUrl.value || !allImages.value.includes(coverUrl.value)) {
    return { ok: false, message: 'Select a cover photo' }
  }
  return { ok: true }
}

defineExpose({ validate, syncUrlImages })
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <p class="text-gray-500 text-sm">
      Add at least one photo and choose a cover image. Upload from your device (optimized automatically) or paste image URLs.
    </p>

    <div class="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
      <button
        type="button"
        class="px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
        :class="activeTab === 'upload' ? 'bg-white shadow text-primary' : 'text-gray-500'"
        @click="activeTab = 'upload'"
      >
        <Upload class="w-4 h-4" /> Upload photos
      </button>
      <button
        type="button"
        class="px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
        :class="activeTab === 'urls' ? 'bg-white shadow text-primary' : 'text-gray-500'"
        @click="activeTab = 'urls'"
      >
        <Link2 class="w-4 h-4" /> Image URLs
      </button>
    </div>

    <div v-if="activeTab === 'upload'" class="space-y-4">
      <div
        class="border-2 border-dashed rounded-2xl p-10 text-center transition-colors"
        :class="dragOver ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300'"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
      >
        <ImagePlus class="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p class="font-medium mb-1">Drag & drop photos here</p>
        <p class="text-sm text-gray-400 mb-4">or browse from your device</p>
        <label class="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors">
          <Upload class="w-4 h-4" />
          Choose files
          <input type="file" accept="image/*" multiple class="hidden" @change="onFileChange" />
        </label>
      </div>

      <div v-if="pendingPreviews.length" class="space-y-3">
        <p class="text-sm font-medium">{{ pendingFiles.length }} photo(s) ready to upload</p>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <div v-for="(preview, index) in pendingPreviews" :key="preview" class="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
            <img :src="preview" alt="" class="w-full h-full object-cover" />
            <button
              type="button"
              class="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-white"
              @click="removePending(index)"
            >
              <Trash2 class="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </div>
        <button
          type="button"
          class="bg-secondary text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
          :disabled="uploading"
          @click="confirmUpload"
        >
          <Loader2 v-if="uploading" class="w-4 h-4 animate-spin" />
          <Upload v-else class="w-4 h-4" />
          Upload & optimize
        </button>
        <p v-if="uploadError" class="text-sm text-error">{{ uploadError }}</p>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div v-for="row in urlInputs" :key="row.id" class="flex items-center gap-2">
        <input
          v-model="row.value"
          type="url"
          placeholder="https://example.com/photo.jpg"
          class="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm"
        />
        <button
          type="button"
          class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
          aria-label="Remove URL"
          @click="removeUrlInput(row.id)"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
        @click="addUrlInput"
      >
        <Plus class="w-4 h-4" /> Add another URL
      </button>
    </div>

    <section v-if="allImages.length" class="space-y-3 pt-4 border-t border-gray-100">
      <h3 class="font-semibold">Listing photos ({{ allImages.length }})</h3>
      <p class="text-sm text-gray-500">Tap a photo to set it as the cover — it appears first on your listing.</p>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
        <div
          v-for="url in allImages"
          :key="url"
          class="relative aspect-square rounded-xl overflow-hidden border-2 transition-colors cursor-pointer"
          :class="coverUrl === url ? 'border-secondary ring-2 ring-secondary/30' : 'border-gray-200 hover:border-gray-300'"
          @click="setCover(url)"
        >
          <img :src="url" alt="" class="w-full h-full object-cover" />
          <span
            v-if="coverUrl === url"
            class="absolute top-2 left-2 bg-secondary text-white text-[10px] font-bold uppercase px-2 py-1 rounded-md inline-flex items-center gap-1"
          >
            <Star class="w-3 h-3 fill-current" /> Cover
          </span>
          <button
            type="button"
            class="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-white"
            @click.stop="removeImage(url)"
          >
            <Trash2 class="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
