<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      <v-container>
        <h1>Страница, которую вы запрашиваете - не найдена</h1>
        <p>
          Вернитесь на
          <router-link :to="{ name: 'Index' }">главную</router-link> и повторите
          ваш запрос снова
        </p>
      </v-container>
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>

<script>
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import { useI18n } from '~/common/composable/i18n'
import { createHeaders } from '~/common/helpers/seo'

export default defineComponent({
  name: 'EmptyLayout',
  layout: 'empty',
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
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {},
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
