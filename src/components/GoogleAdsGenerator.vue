<template>
  <div>
    <h1 class="title mb-3">Генератор объявлений Google Ads</h1>
    <p>Создайте кампанию в Google AdWords из ключевых слов и масок за 60 секнуд! Утилита генерирует группы объявлений (1
      ключ = 1 группа), ключевые слова в выбранных вами типах соответствия и объявления в группе. В объявления можно
      подставлять ключ или N-ное по счету слово из ключа. Скопируйте результат, вставьте в AdWords Editor. Отлично
      подойдет, чтобы быстро собрать структуру кампании по маскам или для SKA (Single Keyword Adgroup).</p>
    <v-layout row>
      <v-flex md4>
        <v-textarea
          filled
          label="Вставьте сюда ключевые слова"
          :rows="8"
          v-model="keywords"
          class="mb-0"
        />
        <v-checkbox v-model="matchtypes.phrase" hide-details label="Фразовое соответствие"></v-checkbox>
        <v-checkbox v-model="matchtypes.exact" hide-details label="Точное соттвестствие"></v-checkbox>
        <p class="mt-4 mb-0">
          Можно задать уникальный URL и/или Заголовок 1 для любого ключа в формате:
          <strong><code>keyword|url|заголовок1</code></strong>
        </p>
        <p class="mb-0">
          Только URL: <strong><code>keyword|url</code></strong><br/>
        </p>
        <p class="mb-0">
          Только заголовок: <strong><code>keyword||заголовок1</code></strong>
        </p>
        <p>
          Пример: <strong><code>панель-пвх||Купить панель-пвх</code></strong>
        </p>
      </v-flex>
      <v-flex md4>
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="(ad, index) in ads" :key="index">
            <v-expansion-panel-header>
              <div>
                <span class="pa-0">
                  Объявление {{ index + 1 }}
                </span>
                <span class="pa-0">
                  <v-icon v-if="isValidAd(ad)" small color="success">check_circle</v-icon>
                  <v-tooltip v-else top>
                    <template v-slot:activator="{ on }">
                      <v-icon small color="warning" v-on="on">error</v-icon>
                    </template>
                    <span>Не заполнены все обязательные поля. Объявление не будет включено в сгенерированную кампанию</span>
                  </v-tooltip>
                </span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>

              <v-text-field
                v-model="ad.h1"
                :maxlength="validation.titleMaxLength"
                :counter="validation.titleMaxLength"
                label="Заголовок 1 *"
                placeholder="Например: {KeyWord:[KeyWord]}"
              />
              <v-text-field
                v-model="ad.h2"
                :maxlength="validation.titleMaxLength"
                :counter="validation.titleMaxLength"
                label="Заголовок 2 *"
                placeholder="Здесь текст второго заголовка"
              />
              <v-text-field
                v-model="ad.h3"
                :maxlength="validation.titleMaxLength"
                :counter="validation.titleMaxLength"
                label="Заголовок 3"
                placeholder="3-й заголовок не обязателен, но желателен"
              />
              <v-textarea
                v-model="ad.d1"
                :maxlength="validation.descMaxLength"
                :counter="validation.descMaxLength"
                rows="2"
                label="Описание 1 *"
              />
              <v-textarea
                v-model="ad.d2"
                :maxlength="validation.descMaxLength"
                :counter="validation.descMaxLength"
                rows="2"
                label="Описание 2"
              />
              <v-layout row>
                <v-flex>
                  <v-text-field
                    v-model="ad.p1"
                    :maxlength="validation.pathMaxLength"
                    :counter="validation.pathMaxLength"
                    label="Путь 1"
                  />
                </v-flex>
                <v-flex class="my-auto">
                  <v-icon>/</v-icon>
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="ad.p2"
                    :maxlength="validation.pathMaxLength"
                    :counter="validation.pathMaxLength"
                    label="Путь 2"
                  />
                </v-flex>
              </v-layout>
              <v-text-field
                v-model="ad.url"
                label="Адрес целевой страницы *"
                placeholder="https://yaroshenko.tools"
                type="url"
              />
              <v-row no-gutters>
                <v-btn text small @click.prevent="deleteAd(index)" class="red--text">Удалить</v-btn>
                <v-btn text small @click.prevent="copyAd(index)" class="right">Скопировать объявление</v-btn>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-col class="d-flex justify-center">
          <v-btn fab small color="blue-grey" class="white--text" @click="addAds()">
            <v-icon>add</v-icon>
          </v-btn>
        </v-col>
        <div>
          <p class="subheading">Макросы утилиты для объявлений:</p>
          <p>
            <strong>[KeyWord]</strong>, <strong>[Keyword]</strong>, <strong>[keyword]</strong> - подставляют ключевое
            слово из списка вместо макроса в соответствующем регистре.
          </p>
          <p>
            <strong>[word1]</strong>, <strong>[Word1]</strong>, ..., <strong>[word5]</strong>, <strong>[Word5]</strong>
            - подставляют выбранное вами по счету слово из ключевого слова из списка вместо макроса в соответствующем
            регистре.
          </p>
        </div>
      </v-flex>
      <v-flex md4>
        <v-text-field filled class="mb-3" label="Название кампании" v-model="campaignName"
                      hint="Если импортируете в уже созданную кампанию, просто скопируйте ее точное название сюда."
                      persistent-hint=""/>
        <v-btn color="success" class="ml-0" @click="getCampaign()" :loading="loading">
          Сгенерировать кампанию
        </v-btn>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="downloadCsv" :loading="loadingCsv" text icon>
              <v-icon>cloud_download</v-icon>
            </v-btn>
          </template>
          <span>Скачать кампанию в формате .CSV</span>
        </v-tooltip>
        <v-tooltip top v-if="campaignHtml">
          <template v-slot:activator="{ on }">
            <v-btn class="ml-0" v-on="on" @click="copyResult()" text icon>
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
          <li>В меню AdWords Editor: «Аккаунт» -> «Импорт» -> «Вставить текст» (или «Из файла» для скачанной
            кампании).
          </li>
          <li>Вставьте скопированный фрагмент туда.</li>
        </ul>
      </v-flex>
    </v-layout>
    <v-layout v-if="campaignHtml">
      <v-card full-width class="elevation-3">
        <v-card-text>
          <v-flex>
            <v-btn class="ml-0" @click="copyResult()">
              <v-icon small class="mr-1">file_copy</v-icon>
              Скопировать кампанию в буфер обмена
            </v-btn>
            <v-btn class="" @click="downloadCsv()" :loading="loadingCsv">
              <v-icon small class="mr-1">cloud_download</v-icon>
              Скачать кампанию в формате .csv
            </v-btn>
          </v-flex>
          <v-flex>
            <div class="caption" v-html="campaignHtml"></div>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-layout>
    <v-layout>
      <v-flex class="text-xs-center">
        <h3>Как пользоваться генератором Google Ads. Обучающее видео</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/KIcH5LyuY5k" frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import utils from '../utils'

export default {
  name: "GoogleAdsGenerator",
  data: () => ({
    validation: {
      titleMaxLength: 30,
      descMaxLength: 90,
      pathMaxLength: 15,
    },
    campaignName: '',
    keywords: '',
    ads: [{}, {}, {}],
    matchtypes: {
      phrase: false,
      exact: true,
    },
    campaignCsv: '',
    campaignHtml: '',
    loading: false,
    loadingCsv: false,
  }),
  methods: {
    addAds() {
      this.ads.push({});
    },
    deleteAd(adId) {
      if (confirm('Вы уверены, что хотите удалить это объявление?')) {
        this.ads.splice(adId, 1);
      }
    },
    copyAd(adId) {
      this.ads.push(JSON.parse(JSON.stringify(this.ads[adId])));
    },
    copyResult() {
      utils.copyElementToClipboard('table-result');
    },
    downloadCsv() {
      this.loading = false;
      this.loadingCsv = true;
      axios.post(`${process.env.VUE_APP_BACKEND_URL}/campaign-generator`, {
        keywords: this.keywords,
        ads: this.ads,
        matchtypes: this.matchtypes,
        campaignName: this.campaignName,
        downloadCsv: true,
        clientDate: new Date(),
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.campaignName ? this.campaignName : 'campaign'}.csv`);
        document.body.appendChild(link);
        link.click();
        this.loadingCsv = false;
      })
    },
    getCampaign() {
      this.loading = true;
      this.loadingCsv = false;
      axios.post(`${process.env.VUE_APP_BACKEND_URL}/campaign-generator`, {
        keywords: this.keywords,
        ads: this.ads,
        matchtypes: this.matchtypes,
        campaignName: this.campaignName,
      }).then(response => {
        // console.log(response.data.campaign)
        this.campaignHtml = response.data.campaign;
        this.loading = false;
      })
    },

  },
  computed: {
    isValidAd() {
      return ad => ad.h1 && ad.h2 && ad.d1 && ad.url
    }
  },

  created() {
    const storedData = JSON.parse(localStorage.getItem('google-ads-generator'));
    for (let key in storedData) {
      this[key] = storedData[key];
    }
  },
  updated() {
    const objectToSave = JSON.parse(JSON.stringify(this._data));
    delete objectToSave.campaignCsv;
    delete objectToSave.campaignHtml;
    delete objectToSave.loading;
    delete objectToSave.loadingCsv;
    localStorage.setItem('google-ads-generator', JSON.stringify(objectToSave))
  },
}
</script>
