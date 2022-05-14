<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed clipped app temporary left dark>
      <v-list>
        <v-list-item>
          <v-list-item-content></v-list-item-content>
        </v-list-item>
        <v-list-item v-for="(item, i) in items" :key="i" active-class="green" :to="localePath({name: item.linkName})" exact>
          <v-list-item-action class="mr-2">
            <v-icon v-html="item.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="caption font-weight-black" v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app clipped-left dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <nuxt-link v-slot="{navigate}" :to="localePath({ name: 'index' })" custom class="pointer pl-0 ml-0 mr-3">
        <v-toolbar-title  role="link" @click="navigate" @keypress.enter="navigate">
          <v-app-bar-nav-icon>
            <img src="logo-tools.png" class="logo"/>
          </v-app-bar-nav-icon>
          yaroshenko.tools
        </v-toolbar-title>
      </nuxt-link>
      <span class="mr-3 hidden-sm-and-down"> Бесплатные утилиты для работы с контекстной рекламой</span>
      <span class="mr-3"> Telegram: <a href="https://t.me/yaroshenko_tools" rel="noreferrer" target="_blank">@yaroshenko_tools</a></span>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container fluid grid-list-xl class="white pa-5">
        <Nuxt />
        <div class="mt-4 text--disabled">
          <v-divider class="mb-4"/>
          <v-layout row>
            <v-flex>
              <ul>
                <li>
                  <nuxt-link :to="localePath({ name: 'utm' })">Генератор UTM-меток</nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="localePath({ name: 'google-ads-generator' })">Генератор объявлений Google Ads</nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="localePath({ name: 'stats-calc' })">Калькулятор статистической значимости</nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="localePath({ name: 'matchtypes' })">Конвертер типов соответствия Google Ads</nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="localePath({ name: 'matchtypes-direct' })">Конвертер типов соответствия Яндекс.Директ</nuxt-link>
                </li>
              </ul>
            </v-flex>
            <v-flex>
              <ul>
                <li><a href="https://yaroshenko.by" target="_blank">Блог Ярошенко</a></li>
                <li><a href="https://web7.pro" target="_blank">Блог опытного вебмастера</a></li>
                <li><a href="https://salespark.org" target="_blank">Заказать контекст</a></li>
              </ul>
            </v-flex>
          </v-layout>
          <p class="mt-4">
            Хотите что-то добавить, предложить новую утилиту или нашли баг? Напишите в чат в телеграмме <a
            href="https://t.me/yaroshenko_tools" target="_blank">@yaroshenko_tools</a>
          </p>
          <span>&copy; 2019 yaroshenko.tools</span>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: ()  => ({
      drawer: false,
      mini: true,
      items: [
        {
          icon: 'list',
          title: 'Все утилиты',
          linkName: 'index'
        },
        {
          icon: 'link',
          title: 'Генератор UTM-меток',
          linkName: 'utm'
        },
        {
          icon: 'dvr',
          title: 'Генератор Google Ads',
          linkName: 'google-ads-generator'
        },
        {
          icon: 'trending_up',
          title: 'Статистическая значимость',
          linkName: 'stats-calc'
        },
        {
          icon: 'compare_arrows',
          title: 'Типы соответствия Google Ads',
          linkName: 'matchtypes'
        },
        {
          icon: 'compare_arrows',
          title: 'Операторы Яндекс.Директ',
          linkName: 'matchtypes-direct'
        },
      ],
  }),
  head () {
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
