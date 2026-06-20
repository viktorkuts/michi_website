<script setup lang="ts">
const { data: page } = await useAsyncData('legal-account-deletion', () =>
  queryCollection('legal').path('/legal/account-deletion').first(),
)

useHead({
  title: page.value?.title ? `${page.value.title} — Michi` : 'Account Deletion — Michi',
  meta: [
    { name: 'description', content: page.value?.description ?? 'How to delete your Michi account.' },
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
