<template>
  <div>
    <h1 class="title mb-3">{{ $t('google_ads_generator_h1') }}</h1>
    <p>
      <nuxt-content :document="subDescription" />
    </p>
    <v-layout row>
      <v-flex md4>
        <v-row>
          <v-col>
            <v-textarea
              v-model="keywords"
              filled
              :label="$t('google_ads_generator_field_keyword_label')"
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
              :label="$t('google_ads_generator_field_phrase_label')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-checkbox
              v-model="matchtypes.exact"
              hide-details
              dense
              :label="$t('google_ads_generator_field_exact_label')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-checkbox
              v-model="matchtypes.broad"
              class="mt-0"
              :messages="$t('google_ads_generator_field_wide_message')"
              :label="$t('google_ads_generator_field_wide_label')"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p><nuxt-content :document="keywordTips" /></p>
          </v-col>
        </v-row>
      </v-flex>
      <v-flex md4>
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="(ad, index) in ads" :key="index">
            <v-expansion-panel-header>
              <div>
                <span class="pa-0">
                  {{ $t('google_ads_generator_ad') }} {{ index + 1 }}
                </span>
                <span class="pa-0">
                  <v-icon v-if="ads[index].formValid" small color="success"
                    >check_circle</v-icon
                  >
                  <v-tooltip v-else top>
                    <template #activator="{ on }">
                      <v-icon small color="warning" v-on="on">error</v-icon>
                    </template>
                    <span>
                      {{ $t('google_ads_generator_fields_werent_filled') }}
                    </span>
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
                >
                  {{ $t('common_delete') }}
                </v-btn>
                <v-btn text small class="right" @click.prevent="copyAd(index)">
                  {{ $t('google_ads_generator_copy') }}
                </v-btn>
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
          <p>{{ macrosTips.title }}</p>
          <p><nuxt-content :document="macrosTips" /></p>
        </div>
      </v-flex>
      <v-flex md4>
        <v-text-field
          v-model="campaignName"
          filled
          class="mb-3"
          :label="$t('google_ads_generator_field_campaign_name_label')"
          :hint="$t('google_ads_generator_field_campaign_name_hint')"
          persistent-hint
        />
        <v-btn
          color="success"
          class="ml-0"
          :loading="loading"
          :disabled="!isFormsValid"
          @click="getCampaign()"
        >
          {{ $t('google_ads_generator_generate') }}
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
          <span>{{ $t('google_ads_generator_download_csv') }}</span>
        </v-tooltip>
        <v-tooltip v-if="campaignResult" top>
          <template #activator="{ on }">
            <v-btn class="ml-0" text icon v-on="on" @click="copyResult()">
              <v-icon>file_copy</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('google_ads_generator_copy_campaign') }}</span>
        </v-tooltip>
        <h4 class="subheading mt-4">{{ howToUseTip.title }}</h4>
        <nuxt-content :document="howToUseTip" />
      </v-flex>
    </v-layout>
    <v-layout v-if="campaignResult">
      <v-card full-width class="elevation-3">
        <v-card-text>
          <v-flex>
            <v-btn class="ml-0" @click="copyResult()">
              <v-icon small class="mr-1">file_copy</v-icon>
              {{ $t('google_ads_generator_copy_campaign') }}
            </v-btn>
            <v-btn class="" :loading="loadingCsv" @click="downloadCsv()">
              <v-icon small class="mr-1">cloud_download</v-icon>
              {{ $t('google_ads_generator_download_csv') }}
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
        <h3>{{ $t('google_ads_generator_video') }}</h3>
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
  async asyncData({ $content, i18n }) {
    const subDescription = await $content(
      i18n.locale,
      'google-ads-generator/subdescription'
    ).fetch()

    const keywordTips = await $content(
      i18n.locale,
      'google-ads-generator/keyword-tips'
    ).fetch()

    const macrosTips = await $content(
      i18n.locale,
      'google-ads-generator/macros-tips'
    ).fetch()

    const howToUseTip = await $content(
      i18n.locale,
      'google-ads-generator/how-to-use-tip'
    ).fetch()

    return {
      subDescription,
      keywordTips,
      macrosTips,
      howToUseTip,
    }
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
