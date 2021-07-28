<template>
  <v-app>
    <v-navigation-drawer fixed clipped app temporary v-model="drawer" left dark>
      <v-list>
        <v-list-item>
          <v-list-item-content></v-list-item-content>
        </v-list-item>
        <v-list-item active-class="green" v-for="(item, i) in items" :key="i" :to="{name:item.linkName}" exact>
          <v-list-item-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app clipped-left dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link :to="{ name: 'Index' }" v-slot="{navigate}" custom class="pointer pl-0 ml-0 mr-3">
        <v-toolbar-title  @click="navigate" @keypress.enter="navigate" role="link">
          <v-app-bar-nav-icon>
            <img :src="logo" class="logo"/>
          </v-app-bar-nav-icon>
          yaroshenko.tools
        </v-toolbar-title>
      </router-link>
      <span class="mr-3 hidden-sm-and-down"> Бесплатные утилиты для работы с контекстной рекламой</span>
      <span class="mr-3"> Telegram: <a href="https://t.me/yaroshenko_tools" rel="noreferrer" target="_blank">@yaroshenko_tools</a></span>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container fluid grid-list-xl class="white pa-5">
        <router-view/>
        <div class="mt-4 text--disabled">
          <v-divider class="mb-4"/>
          <v-layout row>
            <v-flex>
              <ul>
                <li>
                  <router-link :to="{ name: 'UtmGenerator' }">Генератор UTM-меток</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'GoogleAdsGenerator' }">Генератор объявлений Google Ads</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'StatisticalSignificance' }">Калькулятор статистической значимости</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'Matchtypes' }">Конвертер типов соответствия Google Ads</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'MatchtypesDirect' }">Конвертер типов соответствия Яндекс.Директ</router-link>
                </li>
              </ul>
            </v-flex>
            <v-flex>
              <ul>
                <li><a href="https://yaroshenko.by" target="_blank">Блог Ярошенко</a></li>
                <li><a href="https://romua1d.ru" target="_blank">Блог опытног вебмастера</a></li>
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
  import logo from "./assets/logo-tools.png"

  export default {
    data() {
      return {
        drawer: false,
        mini: true,
        logo: logo,
        items: [
          {
            icon: 'list',
            title: 'Все утилиты',
            linkName: 'Index'
          },
          {
            icon: 'link',
            title: 'Генератор UTM-меток',
            linkName: 'UtmGenerator'
          },
          {
            icon: 'dvr',
            title: 'Генератор Google Ads',
            linkName: 'GoogleAdsGenerator'
          },
          {
            icon: 'trending_up',
            title: 'Статистическая значимость',
            linkName: 'StatisticalSignificance'
          },
          {
            icon: 'compare_arrows',
            title: 'Типы соответствия Google Ads',
            linkName: 'Matchtypes'
          },
          {
            icon: 'compare_arrows',
            title: 'Операторы Яндекс.Директ',
            linkName: 'MatchtypesDirect'
          },
        ],
      }
    },
    computed: {
      chevronIcon() {
        return this.mini ? 'chevron_right' : 'chevron_left'
      },
    },
    name: 'App'
  }
</script>
<style>
  .logo {
    height: 30px;
    width: 30px;
    -webkit-transition: -webkit-transform 10s linear;
    transition: transform 10s linear;
    /*filter: invert(100%);*/
  }

  .logo:hover {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

  .pointer {
    cursor: pointer;
  }

  .nowrap {
    white-space: nowrap;
  }
</style>
