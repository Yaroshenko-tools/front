<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed clipped app temporary left dark>
      <v-list>
        <v-list-item>
          <v-list-item-content></v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          active-class="green"
          :to="localePath({ name: item.linkName })"
          exact
        >
          <v-list-item-action class="mr-2">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              class="caption font-weight-black"
              v-text="item.title"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app clipped-left dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <nuxt-link
        v-slot="{ navigate }"
        :to="localePath({ name: 'index' })"
        custom
        class="pointer pl-0 ml-0 mr-3"
      >
        <v-toolbar-title
          role="link"
          @click="navigate"
          @keypress.enter="navigate"
        >
          <v-app-bar-nav-icon>
            <img src="/logo-tools.png" class="logo" />
          </v-app-bar-nav-icon>
          yaroshenko.tools
        </v-toolbar-title>
      </nuxt-link>
      <span class="mr-3 hidden-sm-and-down">{{ $t('index_head_title') }}</span>
      <span class="mr-3">
        Telegram:
        <a href="https://t.me/yaroshenko_tools" rel="noreferrer" target="_blank"
          >@yaroshenko_tools</a
        ></span
      >
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container fluid grid-list-xl class="white pa-5">
        <Nuxt />
        <div class="mt-4 text--disabled">
          <v-divider class="mb-4" />
          <v-layout row>
            <v-flex>
              <ul>
                <li>
                  <nuxt-link :to="localePath({ name: 'utm' })">{{
                    $t('utm_h1')
                  }}</nuxt-link>
                </li>
                <li>
                  <nuxt-link
                    :to="localePath({ name: 'google-ads-generator' })"
                    >{{ $t('google_ads_generator_h1') }}</nuxt-link
                  >
                </li>
                <li>
                  <nuxt-link :to="localePath({ name: 'stats-calc' })">{{
                    $t('stats_calc_h1')
                  }}</nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="localePath({ name: 'matchtypes' })">{{
                    $t('matchtypes_h1')
                  }}</nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="localePath({ name: 'matchtypes-direct' })">{{
                    $t('matchtypes_direct_h1')
                  }}</nuxt-link>
                </li>
              </ul>
            </v-flex>
            <v-flex>
              <ul>
                <li>
                  <a href="https://yaroshenko.by" target="_blank">{{
                    $t('footer_blog_yaroshenko')
                  }}</a>
                </li>
                <li>
                  <a href="https://web7.pro" target="_blank">{{
                    $t('footer_blog_expirienced_webmaster')
                  }}</a>
                </li>
                <li>
                  <a href="https://salespark.org" target="_blank">{{
                    $t('footer_sales_park')
                  }}</a>
                </li>
              </ul>
            </v-flex>
          </v-layout>
          <p class="mt-4">
            {{ $t('common_bug') }}
            <a href="https://t.me/yaroshenko_tools" target="_blank"
              >@yaroshenko_tools</a
            >
          </p>
          <span>&copy; 2019 yaroshenko.tools</span>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useI18n } from '~/common/composable/i18n'

export default {
  name: 'App',
  setup() {
    const { t } = useI18n()
    const items = [
      {
        icon: 'list',
        title: t('utils'),
        linkName: 'index',
      },
      {
        icon: 'link',
        title: t('utm_h1'),
        linkName: 'utm',
      },
      {
        icon: 'dvr',
        title: t('google_ads_generator_h1'),
        linkName: 'google-ads-generator',
      },
      {
        icon: 'trending_up',
        title: t('stats_calc_h1'),
        linkName: 'stats-calc',
      },
      {
        icon: 'compare_arrows',
        title: t('matchtypes_h1'),
        linkName: 'matchtypes',
      },
      {
        icon: 'compare_arrows',
        title: t('matchtypes_direct_h1'),
        linkName: 'matchtypes-direct',
      },
    ]

    return { items }
  },

  data: () => ({
    drawer: false,
    mini: true,
  }),
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true })
  },
}
</script>
<style>
.logo {
  height: 30px;
  width: 30px;
  transition: transform 10s linear;
}

.logo:hover {
  transform: rotate(360deg);
}

.pointer {
  cursor: pointer;
}

.nowrap {
  white-space: nowrap;
}
</style>
