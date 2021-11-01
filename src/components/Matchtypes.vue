<template>
  <div>
    <h1 class="title mb-3">Конвертер типов соответствия ключевых слов Google Ads</h1>
    <p class="mb-0">
      {{$route.meta.description}}
    </p>
    <v-layout row>
      <v-flex class="pt-0 pb-0" xs12 sm6 md6>
        <v-checkbox v-model="broad" hide-details label="Широкое соответствие"></v-checkbox>
      </v-flex>
      <v-flex class="pt-0 pb-0" xs12 sm6 md6>
        <v-checkbox v-model="phrase" hide-details label="Фразовое соответствие"></v-checkbox>
        <v-checkbox v-model="exact" hide-details label="Точное соттвестствие"></v-checkbox>
      </v-flex>
    </v-layout>


    <v-layout row>
      <v-flex xs12 sm6 md6>
        <v-textarea class="" v-model="keywords" rows="12" filled
                    label="Скопируйте сюда ключевые слова, каждое с новой строки"></v-textarea>
      </v-flex>
      <v-flex xs12 sm6 md6>
        <!--<v-textarea filled v-model="result" rows="10" label="Здесь появится результат" id="result"></v-textarea>-->
        <v-card color="grey lighten-3 elevation-0 scroll caption" height="255">
          <v-card-text v-html="result" id="result" contenteditable="true"></v-card-text>
        </v-card>
        <v-btn class="success ml-0" @click="copyResult">
          <v-icon small>file_copy</v-icon>&nbsp;
          Скопировать
        </v-btn>
      </v-flex>

    </v-layout>
  </div>
</template>

<script>
  import utils from '../utils'

  export default {
    name: "Matchtypes",
    data: () => ({
      broad: false,
      phrase: false,
      exact: true,
      keywords: '',
    }),
    computed: {
      result() {
        let keywords = this.keywords.split("\n");
        let result = '';
        for (let i in keywords) {
          let keyword = keywords[i].trim()
            .replaceAll('\\+', '')
            .replaceAll('\\-', '')
            .replaceAll('\\[', '')
            .replaceAll('\\]', '')
            .replaceAll('\\"', '')
            .replace(/ +(?= )/g, '');

          if (keyword) {
            if (this.broad) {
              // result = result + keyword + "\n";
              result = result + `<div class="grey--text text--darken-4">${keyword}</div>`;
            }
            if (this.phrase) {
              // result = result + '"' + keyword + '"' + "\n";
              result = result + `<div class="blue--text text--darken-4">"${keyword}"</div>`;
            }
            if (this.exact) {
              // result = result + '[' + keyword + ']' + "\n";
              result = result + `<div class="green--text text--darken-4">[${keyword}]</div>`;
            }
          }
        }
        return result;
      },
    },
    created() {
      const storedData = JSON.parse(localStorage.getItem('matchtypes'));
      for (let key in storedData) {
        this[key] = storedData[key];
      }
    },
    updated() {
      localStorage.setItem('matchtypes', JSON.stringify(this._data))
    },
    methods: {
      copyResult() {
        // this.$copyText(this.result)
        utils.copyElementToClipboard('result');
      },
    },
  }
  String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };
</script>

<style scoped>
  .scroll {
    overflow-y: auto;
  }
</style>
