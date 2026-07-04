<script setup lang="ts">
const { data: page } = await useAsyncData('legal-terms-fr', () =>
  queryCollection('legal').path('/legal/terms-fr').first(),
)

useHead({
  title: page.value?.title ? `${page.value.title} — Michi` : 'Conditions d\'utilisation — Michi',
  meta: [
    { name: 'description', content: page.value?.description ?? 'Conditions d\'utilisation de Michi.' },
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
