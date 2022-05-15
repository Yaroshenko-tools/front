<template>
  <div>
    <v-card class="pa-3">
      <h1>{{ $t('index_h1') }}</h1>
      <v-list two-line>
        <template v-for="(item, key) in items">
          <div :key="key">
            <nuxt-link
              v-slot="{ navigate }"
              custom
              :to="localePath({ name: item.linkName })"
            >
              <v-list-item
                role="link"
                @click="navigate"
                @keypress.enter="navigate"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <nuxt-link :to="localePath({ name: item.linkName })">{{
                      item.title
                    }}</nuxt-link>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.subtitle
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </nuxt-link>
          </div>
        </template>
      </v-list>
    </v-card>
  </div>
</template>
<script>
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import { useI18n } from '~/common/composable/i18n'
import { createHeaders } from '~/common/helpers/seo'

export default defineComponent({
  name: 'TheIndex',
  setup() {
    const { t } = useI18n()

    useMeta(createHeaders(t('index_seo_title'), t('index_seo_description')))

    const items = [
      {
        title: t('utm_h1'),
        subtitle: t('utm_subtitle'),
        linkName: 'utm',
      },
      {
        title: t('google_ads_generator_h1'),
        subtitle: t('google_ads_generator_subtitle'),
        linkName: 'google-ads-generator',
      },
      {
        title: t('stats_calc_h1'),
        subtitle: t('stats_calc_subtitle'),
        linkName: 'stats-calc',
      },
      {
        title: t('matchtypes_h1'),
        subtitle: t('matchtypes_subtitle'),
        linkName: 'matchtypes',
      },
      {
        title: t('matchtypes_direct_h1'),
        subtitle: t('matchtypes_direct_subtitle'),
        linkName: 'matchtypes-direct',
      },
    ]

    return { items }
  },
  head() {},
})
</script>
