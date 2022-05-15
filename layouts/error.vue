<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      <v-container>
        <h1>{{ $t('not_found_title') }}</h1>
        <p>{{ $t('not_found_go_home') }}</p>
      </v-container>
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink :to="localePath({ name: 'index' })">
      {{ $t('not_found_home') }}
    </NuxtLink>
  </v-app>
</template>

<script>
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import { useI18n } from '~/common/composable/i18n'
import { createHeaders } from '~/common/helpers/seo'

export default defineComponent({
  name: 'TheError',
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const { t } = useI18n()

    useMeta(
      createHeaders(t('not_found_seo_title'), t('not_found_seo_description'))
    )
  },
  head() {},
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
