<template>
  <div>
    <h1 class="title mb-3">
      {{ $t('matchtypes_direct_seo_title') }}
    </h1>
    <p class="mb-0">
      {{ $t('matchtypes_direct_description') }}
    </p>
    <v-layout row>
      <v-flex class="pt-0 pb-0" xs12 sm6 md6>
        <v-checkbox
          v-model="noOperators"
          hide-details
          :label="$t('matchtypes_field_not_fix_label')"
        />

        <v-checkbox
          v-model="quotes"
          hide-details
          :label="`'${$t('matchtypes_field_fix_count_words_label')}'`"
        />
        <v-checkbox
          v-model="exact"
          hide-details
          :label="$t('matchtypes_field_fix_word_form_label')"
        />
        <v-checkbox
          v-model="quotesAndExact"
          hide-details
          :label="`'${$t('matchtypes_field_fix_count_word_form_label')}'`"
        />
      </v-flex>
      <v-flex class="pt-0 pb-0" xs12 sm6 md6>
        <v-checkbox
          v-model="brackets"
          hide-details
          :label="$t('matchtypes_field_fix_order_word_label')"
        />
        <v-checkbox
          v-model="quotesAndBrackets"
          hide-details
          :label="`'${$t('matchtypes_field_fix_order_word_and_count_label')}'`"
        />
        <v-checkbox
          v-model="quotesBracketsAndExact"
          hide-details
          :label="`'${$t(
            'matchtypes_field_fix_order_word_and_count_and_form_label'
          )}'`"
        />
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 md6>
        <v-textarea
          v-model="keywords"
          class=""
          rows="12"
          filled
          :label="$t('matchtypes_field_keyword_label')"
        />
      </v-flex>
      <v-flex xs12 sm6 md6>
        <!--<v-textarea filled v-model="result" rows="10" label="Здесь появится результат" id="result"></v-textarea>-->
        <v-card color="grey lighten-3 elevation-0 scroll caption" height="255">
          <v-card-text id="result" contenteditable="true" v-html="result" />
        </v-card>
        <v-btn class="success ml-0" @click="copyResult">
          <v-icon small>file_copy</v-icon>&nbsp; {{ $t('common_copy') }}
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import utils from '~/common/utils'
import { useI18n } from '~/common/composable/i18n'
import { createHeaders } from '~/common/helpers/seo'

export default defineComponent({
  name: 'MatchtypesDirect',
  setup() {
    const { t } = useI18n()

    useMeta(
      createHeaders(
        t('matchtypes_direct_seo_title'),
        t('matchtypes_direct_seo_description')
      )
    )
  },
  data: () => ({
    noOperators: true,
    quotes: true,
    brackets: false,
    exact: true,
    quotesAndBrackets: false,
    quotesAndExact: true,
    quotesBracketsAndExact: false,
    keywords: '',
  }),
  head() {},
  computed: {
    result() {
      const keywords = this.keywords.split('\n')
      let result = ''
      for (const i in keywords) {
        const keyword = keywords[i]
          .trim()
          // .replaceAll('\\+', '')
          .replaceAll('\\-', '')
          .replaceAll('\\[', '')
          .replaceAll('\\]', '')
          .replaceAll('\\"', '')
          .replace(/ +(?= )/g, '')
        //
        if (keyword) {
          // eslint-disable-next-line no-useless-escape
          const exactKeyword =
            '!' + keyword.replaceAll('\\+', '').replaceAll(' ', ' !')
          const keywordNoPluses = keyword.replaceAll('\\+', '')
          if (this.noOperators) {
            result =
              result + `<div class="grey--text text--darken-4">${keyword}</div>`
          }
          if (this.quotes) {
            // eslint-disable-next-line no-useless-escape
            result =
              result +
              `<div class="red--text text--darken-4">"${keywordNoPluses}"</div>`
          }
          if (this.exact) {
            result =
              result +
              `<div class="red--text text--darken-3">${exactKeyword}</div>`
          }
          if (this.brackets) {
            // eslint-disable-next-line no-useless-escape
            result =
              result +
              `<div class="blue--text text--darken-3">[${keyword}]</div>`
          }
          if (this.quotesAndBrackets) {
            // eslint-disable-next-line no-useless-escape
            result =
              result +
              `<div class="blue--text text--darken-4">"[${keywordNoPluses}]"</div>`
          }
          if (this.quotesAndExact) {
            // eslint-disable-next-line no-useless-escape
            result =
              result +
              `<div class="green--text text--darken-3">"${exactKeyword}"</div>`
          }
          if (this.quotesBracketsAndExact) {
            // eslint-disable-next-line no-useless-escape
            result =
              result +
              `<div class="green--text text--darken-4">"[${exactKeyword}]"</div>`
          }
        }
      }
      return result
    },
  },
  mounted() {
    const storedData = JSON.parse(localStorage.getItem('matchtypes-direct'))
    for (const key in storedData) {
      this[key] = storedData[key]
    }
  },
  updated() {
    localStorage.setItem('matchtypes-direct', JSON.stringify(this._data))
  },
  methods: {
    copyResult() {
      // this.$copyText(this.result)
      utils.copyElementToClipboard('result')
    },
  },
})

// eslint-disable-next-line no-extend-native
String.prototype.replaceAll = function (search, replacement) {
  const target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}
</script>

<style scoped>
.scroll {
  overflow-y: auto;
}
</style>
