<template lang="pug">
  div
    v-subheader(class="base-title")
      h1 {{pageTitle}}
</template>
<script>
export default {
  head: () => ({
    title: 'Termékek hozzáadása'
  }),
  data: () => ({
    pageTitle: 'Termékek hozzáadása'
  })
}
</script>
