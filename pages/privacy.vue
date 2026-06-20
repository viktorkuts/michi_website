<script setup lang="ts">
const { data: page } = await useAsyncData('legal-privacy', () =>
  queryCollection('legal').path('/legal/privacy').first(),
)

useHead({
  title: page.value?.title ? `${page.value.title} — Michi` : 'Privacy Policy — Michi',
  meta: [
    { name: 'description', content: page.value?.description ?? 'Michi privacy policy.' },
  ],
})

const toc = computed(() =>
  (page.value?.body?.toc?.links ?? []).flatMap((link: any) => [
    { id: link.id, text: link.text, depth: 2 },
    ...(link.children ?? []).map((c: any) => ({ id: c.id, text: c.text, depth: 3 })),
  ]),
)
</script>

<template>
  <LayoutLegalPage
    v-if="page"
    :title="page.title"
    :updated="page.updated"
    :toc="toc"
  >
    <ContentRenderer :value="page" />
  </LayoutLegalPage>
</template>
