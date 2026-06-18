<script setup lang="ts">
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'
import { usePreferences } from '@/composables/usePreferences'

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { rating: number; comment: string }]
}>()

const { t } = usePreferences()
const rating = ref(0)
const hoverRating = ref(0)
const comment = ref('')

function submit(): void {
  if (!rating.value || comment.value.trim().length < 10) return
  emit('submit', { rating: rating.value, comment: comment.value.trim() })
}
</script>

<template>
  <form class="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4" @submit.prevent="submit">
    <div>
      <p class="font-semibold mb-1">{{ t('review.title') }}</p>
      <p class="text-sm text-gray-500">{{ t('review.subtitle') }}</p>
    </div>

    <div>
      <p class="text-sm font-medium mb-2">{{ t('review.rating') }}</p>
      <div class="flex items-center gap-1">
        <button
          v-for="value in 5"
          :key="value"
          type="button"
          class="p-1"
          @click="rating = value"
          @mouseenter="hoverRating = value"
          @mouseleave="hoverRating = 0"
        >
          <Star
            class="w-6 h-6 transition-colors"
            :class="(hoverRating || rating) >= value ? 'fill-accent text-accent' : 'text-gray-300'"
          />
        </button>
      </div>
    </div>

    <label class="block">
      <span class="text-sm font-medium">{{ t('review.comment') }}</span>
      <textarea
        v-model="comment"
        rows="4"
        required
        minlength="10"
        :placeholder="t('review.placeholder')"
        class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
      />
    </label>

    <button
      type="submit"
      class="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg disabled:opacity-60"
      :disabled="loading || !rating || comment.trim().length < 10"
    >
      {{ loading ? t('review.submitting') : t('review.submit') }}
    </button>
  </form>
</template>
