<template>
  <div>
    <h1 class="title mb-3">Генератор адаптивных объявлений Google Ads</h1>
    <p>
      Создайте кампанию в Google AdWords из ключевых слов и масок за 60 секнуд!
      Утилита генерирует группы объявлений (1 ключ = 1 группа), ключевые слова в
      выбранных вами типах соответствия и объявления в группе. В объявления
      можно подставлять ключ или N-ное по счету слово из ключа. Скопируйте
      результат, вставьте в AdWords Editor. Отлично подойдет, чтобы быстро
      собрать структуру кампании по маскам или для SKA (Single Keyword Adgroup).
    </p>
    <v-layout row>
      <v-flex md4>
        <v-row>
          <v-col>
            <v-textarea
              v-model="keywords"
              filled
              label="Вставьте сюда ключевые слова"
              :rows="8"
              class="mb-0"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-checkbox
              v-model="matchtypes.phrase"
              hide-details
              dense
              label="Фразовое соответствие"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-checkbox
              v-model="matchtypes.exact"
              hide-details
              dense
              label="Точное соответствие"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-checkbox
              v-model="matchtypes.broad"
              class="mt-0"
              messages="В данный момент работает по принципу фразового соотвествия"
              label="Широкое соответствие"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p class="mt-4 mb-0">
              Можно задать уникальный URL и/или Заголовок 1 для любого ключа в
              формате:
              <strong><code>keyword|url|заголовок1</code></strong>
            </p>
            <p class="mb-0">
              Только URL: <strong><code>keyword|url</code></strong
              ><br />
            </p>
            <p class="mb-0">
              Только заголовок:
              <strong><code>keyword||заголовок1</code></strong>
            </p>
            <p>
              Пример:
              <strong><code>панель-пвх||Купить панель-пвх</code></strong>
            </p>
          </v-col>
        </v-row>
      </v-flex>
      <v-flex md4>
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="(ad, index) in ads" :key="index">
            <v-expansion-panel-header>
              <div>
                <span class="pa-0">
                  Адаптивное объявление {{ index + 1 }}
                </span>
                <span class="pa-0">
                  <v-icon v-if="ads[index].formValid" small color="success"
                    >check_circle</v-icon
                  >
                  <v-tooltip v-else top>
                    <template #activator="{ on }">
                      <v-icon small color="warning" v-on="on">error</v-icon>
                    </template>
                    <span
                      >Не заполнены все обязательные поля. Объявление не будет
                      включено в сгенерированную кампанию</span
                    >
                  </v-tooltip>
                </span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <GoogleAdsGeneratorAdForm
                :form-data.sync="ads[index]"
                :form-valid.sync="ads[index].formValid"
              />
              <v-row no-gutters>
                <v-btn
                  text
                  small
                  class="red--text"
                  @click.prevent="deleteAd(index)"
                  >Удалить</v-btn
                >
                <v-btn text small class="right" @click.prevent="copyAd(index)"
                  >Скопировать объявление</v-btn
                >
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-col class="d-flex justify-center">
          <v-btn
            fab
            small
            color="blue-grey"
            class="white--text"
            @click="addAds()"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-col>
        <div>
          <p class="subheading">Макросы утилиты для объявлений:</p>
          <p>
            <strong>[KeyWord]</strong>, <strong>[Keyword]</strong>,
            <strong>[keyword]</strong> - подставляют ключевое слово из списка
            вместо макроса в соответствующем регистре.
          </p>
          <p>
            <strong>[word1]</strong>, <strong>[Word1]</strong>, ...,
            <strong>[word5]</strong>, <strong>[Word5]</strong>
            - подставляют выбранное вами по счету слово из ключевого слова из
            списка вместо макроса в соответствующем регистре.
          </p>
        </div>
      </v-flex>
      <v-flex md4>
        <v-text-field
          v-model="campaignName"
          filled
          class="mb-3"
          label="Название кампании"
          hint="Если импортируете в уже созданную кампанию, просто скопируйте ее точное название сюда."
          persistent-hint=""
        />
        <v-btn
          color="success"
          class="ml-0"
          :loading="loading"
          :disabled="!isFormsValid"
          @click="getCampaign()"
        >
          Сгенерировать кампанию
        </v-btn>
        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn
              :loading="loadingCsv"
              text
              icon
              v-on="on"
              @click="downloadCsv"
            >
              <v-icon>cloud_download</v-icon>
            </v-btn>
          </template>
          <span>Скачать кампанию в формате .CSV</span>
        </v-tooltip>
        <v-tooltip v-if="campaignResult" top>
          <template #activator="{ on }">
            <v-btn class="ml-0" text icon v-on="on" @click="copyResult()">
              <v-icon>file_copy</v-icon>
            </v-btn>
          </template>
          <span>Скопировать кампанию в буфер обмена</span>
        </v-tooltip>
        <h4 class="subheading">Как пользоваться:</h4>
        <ul>
          <li>Заполните нужные поля</li>
          <li>Нажмите «Сгенерировать»</li>
          <li>Скопируйте в буфер</li>
          <li>
            В меню AdWords Editor: «Аккаунт» -> «Импорт» -> «Вставить текст»
            (или «Из файла» для скачанной кампании).
          </li>
          <li>Вставьте скопированный фрагмент туда.</li>
        </ul>
      </v-flex>
    </v-layout>
    <v-layout v-if="campaignResult">
      <v-card full-width class="elevation-3">
        <v-card-text>
          <v-flex>
            <v-btn class="ml-0" @click="copyResult()">
              <v-icon small class="mr-1">file_copy</v-icon>
              Скопировать кампанию в буфер обмена
            </v-btn>
            <v-btn class="" :loading="loadingCsv" @click="downloadCsv()">
              <v-icon small class="mr-1">cloud_download</v-icon>
              Скачать кампанию в формате .csv
            </v-btn>
          </v-flex>
          <v-flex>
            <div class="caption">
              <GoogleAdsGeneratorResultTable :items="campaignResult" />
            </div>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-layout>
    <v-layout>
      <v-flex class="text-xs-center">
        <h3>Как пользоваться генератором Google Ads. Обучающее видео</h3>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/KIcH5LyuY5k"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'

import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import { limits } from '~/common/helpers/rules'
import utils from '~/common/utils'
import { useI18n } from '~/common/composable/i18n'
import { createHeaders } from '~/common/helpers/seo'

const AD_PROTOTYPE = {
  formValid: true,
}

export default defineComponent({
  name: 'GoogleAdsGenerator',
  setup() {
    const { t } = useI18n()

    useMeta(
      createHeaders(
        t('google_ads_generator_seo_title'),
        t('google_ads_generator_seo_description')
      )
    )
  },
  data: () => ({
    validation: limits,
    campaignName: '',
    keywords: '',
    ads: [AD_PROTOTYPE],
    matchtypes: {
      broad: false,
      phrase: false,
      exact: true,
    },
    campaignCsv: '',
    campaignResult: null,
    loading: false,
    loadingCsv: false,
  }),
  head() {},

  computed: {
    isFormsValid() {
      const validItemsList = this.ads.map((item) => {
        return item.formValid
      })

      return validItemsList.every((el) => el === true)
    },

    selectedMatchTypes() {
      const matchtypes = Object.keys(this.matchtypes)
      return matchtypes.filter((item) => this.matchtypes[item])
    },
  },
  mounted() {
    const storedData = JSON.parse(localStorage.getItem('google-ads-generator'))
    for (const key in storedData) {
      this[key] = storedData[key]
    }
  },

  updated() {
    const objectToSave = JSON.parse(JSON.stringify(this._data))
    delete objectToSave.campaignCsv
    delete objectToSave.campaignResult
    delete objectToSave.loading
    delete objectToSave.loadingCsv
    localStorage.setItem('google-ads-generator', JSON.stringify(objectToSave))
  },
  methods: {
    addAds() {
      this.ads.push(AD_PROTOTYPE)
    },
    deleteAd(adId) {
      if (confirm('Вы уверены, что хотите удалить это объявление?')) {
        this.ads.splice(adId, 1)
      }
    },
    copyAd(adId) {
      this.ads.push(JSON.parse(JSON.stringify(this.ads[adId])))
    },
    copyResult() {
      utils.copyElementToClipboard('table-result')
    },
    downloadCsv() {
      this.loading = false
      this.loadingCsv = true
      axios
        .post(`${process.env.VUE_APP_BACKEND_URL}/campaign-generator`, {
          keywords: this.keywords.split(/\r?\n/),
          ads: this.ads,
          matchtypes: this.selectedMatchTypes,
          campaignName: this.campaignName,
          downloadCsv: true,
        })
        .then((response) => {
          this.downloadCsvFile(response.data)
          this.loadingCsv = false
        })
    },
    downloadCsvFile(data) {
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${this.campaignName ? this.campaignName : 'campaign'}-${dayjs().format(
          'YYYY-MM-DD_HH-mm-ss'
        )}.csv`
      )
      document.body.appendChild(link)
      link.click()
    },
    getCampaign() {
      this.loading = true
      this.loadingCsv = false

      axios
        .post(`${process.env.VUE_APP_BACKEND_URL}/campaign-generator`, {
          keywords: this.keywords.split(/\r?\n/),
          ads: this.ads,
          matchtypes: this.selectedMatchTypes,
          campaignName: this.campaignName,
        })
        .then((response) => {
          this.campaignResult = response.data.data
          this.loading = false
        })
    },
  },
})
</script>
