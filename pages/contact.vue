<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Contact — Michi',
  meta: [{ name: 'description', content: 'Get in touch with Michi.' }],
})

const name = ref('')
const email = ref('')
const message = ref('')
const submitting = ref(false)
const sent = ref(false)
const errors = ref<{ name?: string; email?: string; message?: string }>({})

const mailtoFallback = computed(() => {
  const body = `${message.value}\n\n— ${name.value}`
  return `mailto:contact@synqtogether.com?subject=${encodeURIComponent(`Contact from ${name.value}`)}&body=${encodeURIComponent(body)}`
})

function validate(): boolean {
  const e: typeof errors.value = {}
  if (!name.value.trim()) e.name = 'Please tell us your name.'
  if (!/^.+@.+\..+$/.test(email.value)) e.email = 'Please enter a valid email.'
  if (message.value.trim().length < 4) e.message = 'Add a bit more detail.'
  errors.value = e
  return Object.keys(e).length === 0
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  // No backend yet — open mailto and treat as success.
  window.location.href = mailtoFallback.value
  setTimeout(() => {
    submitting.value = false
    sent.value = true
  }, 300)
}
</script>

<template>
  <UiSectionShell bg="primary">
    <div class="contact">
      <header class="contact__head">
        <UiSectionEyebrow>CONTACT</UiSectionEyebrow>
        <h1 class="type-display-md contact__h">Tell us what's up.</h1>
        <p class="type-body-lg contact__b">
          Press, partnerships, support, or anything else — write us a line.
          We read everything.
        </p>
      </header>

      <form v-if="!sent" class="contact__form" @submit.prevent="onSubmit">
        <label class="contact__field">
          <span class="type-caption">YOUR NAME</span>
          <input
            v-model="name"
            type="text"
            autocomplete="name"
            required
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'err-name' : undefined"
          />
          <span v-if="errors.name" id="err-name" class="contact__err">{{ errors.name }}</span>
        </label>

        <label class="contact__field">
          <span class="type-caption">EMAIL</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            required
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'err-email' : undefined"
          />
          <span v-if="errors.email" id="err-email" class="contact__err">{{ errors.email }}</span>
        </label>

        <label class="contact__field">
          <span class="type-caption">MESSAGE</span>
          <textarea
            v-model="message"
            rows="6"
            required
            :aria-invalid="!!errors.message"
            :aria-describedby="errors.message ? 'err-msg' : undefined"
          />
          <span v-if="errors.message" id="err-msg" class="contact__err">{{ errors.message }}</span>
        </label>

        <UiButton
          variant="primary"
          type="submit"
          :disabled="submitting"
        >
          {{ submitting ? 'Sending…' : 'Send' }}
        </UiButton>

        <p class="type-caption contact__fallback">
          OR EMAIL <a :href="mailtoFallback">SUPPORT@SYNQ.APP</a>
        </p>
      </form>

      <div v-else class="contact__sent">
        <span class="type-caption">SENT</span>
        <p class="type-display-sm">Thanks. We'll get back to you.</p>
        <UiButton variant="secondary" to="/">Back home</UiButton>
      </div>
    </div>
  </UiSectionShell>
</template>

<style scoped>
.contact {
  max-width: 38rem;
  margin: 0 auto;
  padding-top: var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.contact__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.contact__h { margin: 0; text-wrap: balance; }
.contact__b { margin: 0; color: var(--ink-secondary); }

.contact__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.contact__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.contact__field input,
.contact__field textarea {
  font: var(--type-body-weight) var(--type-body-size) / var(--type-body-line) var(--font-sans);
  color: var(--ink-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--rule);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  transition: border-color 200ms ease;
  width: 100%;
}
.contact__field input:focus,
.contact__field textarea:focus {
  outline: 0;
  border-color: var(--ink-primary);
  box-shadow: 0 0 0 3px var(--brand-ring);
}
.contact__err {
  font-family: var(--font-mono);
  font-size: var(--type-caption-size);
  color: var(--brand);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.contact__fallback {
  margin: 0;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
}
.contact__fallback a {
  color: var(--ink-primary);
  border-bottom: 1px solid var(--rule);
  transition: border-color 200ms ease;
}
.contact__fallback a:hover {
  border-bottom-color: var(--brand);
}

.contact__sent {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
}
</style>
