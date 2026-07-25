<script setup lang="ts">
const { data: page } = await useAsyncData('legal-child-safety', () =>
  queryCollection('legal').path('/legal/child-safety').first(),
)

useHead({
  title: page.value?.title ? `${page.value.title} — Michi` : 'Child Safety Standards — Michi',
  meta: [
    {
      name: 'description',
      content:
        page.value?.description
        ?? 'Michi has zero tolerance for child sexual abuse and exploitation (CSAE). Our published safety standards and how to report.',
    },
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
