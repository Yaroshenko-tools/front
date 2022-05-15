<template>
  <div>
    <h1 class="title mb-4">{{ $t('utm_h1') }}</h1>
    <div>{{ $t('utm_choose_source_traffic') }}:</div>
    <v-btn class="ml-0 mx-2" small outlined @click="setTrafficSource('adwords')"
      >Google Ads</v-btn
    >
    <v-btn class="ml-0 mx-2" small outlined @click="setTrafficSource('direct')">
      {{ $t('common_yandex_direct') }}
    </v-btn>
    <v-btn class="ml-0 mx-2" small outlined @click="setTrafficSource('vk')"
      >VK.com</v-btn
    >
    <v-btn class="ml-0 mx-2" small outlined @click="setTrafficSource('fb')"
      >Facebook</v-btn
    >
    <v-btn
      class="ml-0 mx-2"
      small
      outlined
      @click="setTrafficSource('instagram')"
      >Instagram</v-btn
    >
    <v-btn
      class="ml-0 mx-2"
      small
      outlined
      @click="setTrafficSource('mytarget')"
      >Target.mail.ru</v-btn
    >
    <v-btn
      class="ml-0 mx-2"
      color="error"
      small
      outlined
      @click="setTrafficSource('reset')"
    >
      {{ $t('common_reset') }}
    </v-btn>
    <v-text-field
      v-model="url"
      :label="$t('utm_field_url_label')"
      :placeholder="$t('utm_field_url_placeholder')"
    ></v-text-field>
    <v-layout row>
      <v-flex xs12 sm6 md6>
        <v-text-field
          v-model="params.utm_source"
          label="utm_source *"
          :placeholder="$t('utm_field_utm_source_placeholder')"
        ></v-text-field>
        <v-text-field
          v-model="params.utm_medium"
          label="utm_medium *"
          :placeholder="$t('utm_field_utm_medium_placeholder')"
        ></v-text-field>
        <v-text-field
          v-model="params.utm_campaign"
          label="utm_campaign *"
          :placeholder="$t('utm_field_utm_campaign_placeholder')"
        ></v-text-field>
        <v-text-field
          v-model="params.utm_content"
          label="utm_content"
          :placeholder="$t('utm_field_utm_content_placeholder')"
        ></v-text-field>
        <v-text-field
          v-model="params.utm_term"
          label="utm_term"
          :placeholder="$t('utm_field_utm_term_placeholder')"
        />
      </v-flex>
      <v-flex xs12 sm6 md6>
        <v-row>
          <v-col>
            <v-textarea
              v-model="result"
              filled
              :label="$t('utm_field_link_utm_tags_label')"
              append-icon="content_copy"
              readonly
              @click:append="copyResult"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row justify="space-between">
              <v-col>
                <v-select
                  v-model="shortUrl.selectedProvider"
                  :disabled="!url"
                  :items="shortUrl.prodivers"
                  :label="$t('utm_field_provider_label')"
                  item-text="name"
                  single-line
                  class="ml-0 mr-2 mt-0 pt-0"
                />
              </v-col>
              <v-col>
                <v-btn
                  class="info ml-0 mr-2"
                  :disabled="!url"
                  type="button"
                  :loading="shortenerLoading"
                  @click="urlShortener"
                >
                  <v-icon small>link</v-icon>&nbsp;
                  {{ $t('utm_get_short_url') }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="shortUrl.val" mt-3>
              <v-col>
                <v-text-field
                  v-model="shortUrl.val"
                  readonly
                  filled
                  class="mt-0 pt-0"
                  append-icon="content_copy"
                  @click:append="copyShortUrl"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-flex>
    </v-layout>

    <v-snackbar v-model="snackbar" :timeout="5000" color="success" right bottom>
      {{ $t('utm_success_copy') }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import { useI18n } from '~/common/composable/i18n'
import { createHeaders } from '~/common/helpers/seo'

export default defineComponent({
  name: 'UtmGenerator',
  setup() {
    const { t } = useI18n()

    useMeta(createHeaders(t('utm_seo_title'), t('utm_seo_description')))
  },
  data: () => ({
    trafficSource: '',
    url: '',
    shortUrl: {
      val: '',
      prodivers: [
        {
          name: 'vk.cc',
        },
        {
          name: 'bit.ly',
        },
      ],
      selectedProvider: 'vk.cc',
    },
    shortenerLoading: false,
    params: {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
    },
    snackbar: false,
  }),
  head() {},
  computed: {
    result() {
      let url = this.url.trim()
      const regeXpHashtag = /(#(.+)?)/gim
      const match = url.match(regeXpHashtag)

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      if (this.url.trim() && (url.match(/\//g) || []).length < 3) {
        url = url + '/'
      }

      url = addParamsToUrl(url, this.params)

      // Если в урле есть хештег, отправляем его в конец
      if (match && match[0]) {
        url = url.replace(match[0], '')
        // url = (match[0] === '#') ? url : url + match[0];
        return url + match[0]
      }

      return url
    },
  },
  watch: {
    result() {
      this.shortUrl.val = ''
    },
  },
  mounted() {
    this.initStorage()
  },
  updated() {
    localStorage.setItem('utm', JSON.stringify(this._data))
  },
  methods: {
    initStorage() {
      const storedData = JSON.parse(localStorage.getItem('utm'))

      // Если версия не имеет selectedProvider, значит перезапишем стор
      if (!storedData?.shortUrl?.selectedProvider) {
        localStorage.setItem('utm', JSON.stringify(this._data))
        return
      }

      for (const key in storedData) {
        this[key] = storedData[key]
      }
    },
    urlShortener() {
      this.shortenerLoading = true
      axios
        .post(`${process.env.VUE_APP_BACKEND_URL}/shortener`, {
          url: this.result,
          provider: this.shortUrl.selectedProvider,
        })
        .then(
          (response) => {
            this.shortUrl.val = response.data.url
            this.shortenerLoading = false
          },
          () => (this.shortenerLoading = false)
        )
    },
    copyShortUrl() {
      this.$copyText(this.shortUrl.val)
      this.snackbar = true
    },
    copyResult() {
      this.$copyText(this.result)
      this.snackbar = true
    },
    setTrafficSource(source) {
      if (source === 'adwords') {
        this.params = {
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: '{campaignid}',
          utm_content: '{creative}',
          utm_term: '{keyword}',
        }
      }
      if (source === 'direct') {
        this.params = {
          utm_source: 'yandex',
          utm_medium: 'cpc',
          utm_campaign: '{campaign_name_lat}',
          utm_content: '{ad_id}',
          utm_term: '{keyword}',
        }
      }
      if (source === 'vk') {
        this.params = {
          utm_source: 'vk',
          utm_medium: 'cpc',
          utm_campaign: '{campaign_id}',
          utm_content: '{ad_id}',
          utm_term: '',
        }
      }
      if (source === 'fb') {
        this.params = {
          utm_source: 'facebook',
          utm_medium: 'cpc',
          utm_campaign: '',
          utm_content: '',
          utm_term: '',
        }
      }
      if (source === 'instagram') {
        this.params = {
          utm_source: 'instagram',
          utm_medium: 'cpc',
          utm_campaign: '',
          utm_content: '',
          utm_term: '',
        }
      }
      if (source === 'mytarget') {
        this.params = {
          utm_source: 'targetmailru',
          utm_medium: 'cpc',
          utm_campaign: '{{campaign_id}}',
          utm_content: '{{banner_id}}',
          utm_term: '{{geo}}.{{gender}}.{{age}}',
        }
      }
      if (source === 'reset') {
        this.params = {
          utm_source: '',
          utm_medium: '',
          utm_campaign: '',
          utm_content: '',
          utm_term: '',
        }
        this.url = ''
      }
    },
  },
})

const addParamsToUrl = (url, params) => {
  const firstSeperator = !url.includes('?') ? '?' : '&'
  const queryStringParts = []
  let isParamExists = false
  for (const key in params) {
    let value = params[key]
    if (value) {
      if (
        value.trim().charAt(0) === '{' ||
        value.trim().charAt(value.length - 1) === '}' ||
        value.trim().charAt(0) === '[' ||
        value.trim().charAt(value.length - 1) === ']'
      ) {
        value = value.trim()
      } else {
        value = encodeURIComponent(value.trim())
      }
      isParamExists = true
      queryStringParts.push(key + '=' + value)
    }
  }
  const queryString = queryStringParts.join('&')
  return url + (isParamExists ? firstSeperator : '') + queryString
}
</script>
