<template>
  <div>
    <v-card class="pa-3">
      <h1>Утилиты для работы с контекстной рекламой</h1>
      <v-list two-line>
        <template v-for="(item, key) in items">
          <div :key="key">
            <nuxt-link v-slot="{navigate}" custom :to="localePath({ name: item.linkName })">
              <v-list-item role="link" @click="navigate" @keypress.enter="navigate">
                <v-list-item-content>
                  <v-list-item-title>
                    <nuxt-link :to="localePath({ name: item.linkName })">{{item.title}}</nuxt-link>
                  </v-list-item-title>
                  <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
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
import {defineComponent, useMeta} from "@nuxtjs/composition-api";
import {useI18n} from "~/common/composable/i18n";
import {createHeaders} from "~/common/helpers/seo";

export default defineComponent({
  name: "TheIndex",
  setup() {
    const {t} = useI18n()

    useMeta(createHeaders(t('index_seo_title'), t('index_seo_description')))
  },
  data: () => ({
    items: [
      {
        title: 'Генератор UTM-меток',
        subtitle: 'Создайте ссылку с UTM-метками для Google Ads, Яндекс.Директ, VK, Facebook, Instagram и target.mail.ru',
        linkName: 'utm'
      },
      {
        title: 'Генератор объявлений для Google Ads',
        subtitle: 'Создайте кампанию в Google AdWords из ключевых слов за 60 секнуд! Генерируйте группы и объявления с ключами, на основе заданных ключей и шаболнов объявлений.',
        linkName: 'google-ads-generator'
      },
      {
        title: 'Калькулятор статистической значимости',
        subtitle: 'Введите число кликов и конверсий (или коэффициент конверсии) и получите интервалы, в которых могут лежать конверсия с вероятностью 70%, 80%, 90%, 95% и 99%',
        linkName: 'stats-calc'
      },
      {
        title: 'Конвертер типов соответствия ключевых слов для Google Ads',
        subtitle: 'Превратите список ключевых слов в ключи в широком, фразовом и точном соответствии',
        linkName: 'matchtypes'
      },
      {
        title: 'Утилита, добавляющая к ключам операторы Яндекс.Директ',
        subtitle: 'Добавьте операторы "!" [прямоугольные скобки] и "кавычки" к вашим ключам для Яндекс.Директ',
        linkName: 'matchtypes-direct'
      }
    ]
  }),
  head() {},
})
</script>
