<template>
  <div class="layout-shell">
    <LayoutNav />
    <LayoutMobileTabBar />
    <main id="main" class="layout-shell__main">
      <slot />
    </main>
    <LayoutFooter />
    <UiLiveTicker />
  </div>
</template>

<style scoped>
.layout-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.layout-shell__main {
  flex: 1 0 auto;
}
</style>
