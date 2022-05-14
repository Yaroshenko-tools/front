<template>
  <div>
    <h1 class="title mb-3">Калькулятор статистической значимости</h1>
    <p class="mb-0">Введите число кликов и конверсий и получите интервалы, в которых может лежать конверсия с
      вероятностью 70%, 80%, 90%, 95% и 99%</p>

    <v-layout row wrap>
      <v-flex xs12 sm12 md6>
        <v-text-field v-model="nCount" type="number" label="Число кликов"></v-text-field>
        <v-layout row>
          <v-flex>
            <v-text-field v-model="convCount" type="number" label="Число конверсий"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field
v-model="convCoef" suffix="%" type="number" label="Коэфициент конверсии"
                          disabled></v-text-field>
          </v-flex>
        </v-layout>
        <p class="caption">
          На диаграмме видно, какая может быть конверсия с вероятностью 95% (доверительный интервал). <br/>
          Вероятность в 95% (<var v-html="'p < 0.05'"></var>) взята как общепринятый уровень статистической значимости.
        </p>
      </v-flex>
      <v-flex xs12 sm12 md6 class="text-xs-center ">
        <v-progress-circular
          :rotate="270"
          :size="210"
          :width="36"
          :value=percentInt95
          :color=cmap[colorId95]
        >
					<span>
						<strong>{{interval95[0]}}%</strong> - <strong>{{interval95[1]}}%</strong><br/>
						<small>±{{interval95[2]}}%</small>
					</span>
        </v-progress-circular>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-card>
          <v-card-text>
            <h3 class="mb-2">Вот насколько значимые получились результаты:</h3>
            <ul>
              <li>С вероятностью <strong>99%</strong> конверсия находится между <strong>{{interval99[0]}}%</strong> и
                <strong>{{interval99[1]}}%</strong>. Отклонение <strong>±{{interval99[2]}}%</strong></li>
              <li>С вероятностью <strong>95%</strong> конверсия находится между <strong>{{interval95[0]}}%</strong> и
                <strong>{{interval95[1]}}%</strong>. Отклонение <strong>±{{interval95[2]}}%</strong></li>
              <li>С вероятностью <strong>90%</strong> конверсия находится между <strong>{{interval90[0]}}%</strong> и
                <strong>{{interval90[1]}}%</strong>. Отклонение <strong>±{{interval90[2]}}%</strong></li>
              <li>С вероятностью <strong>80%</strong> конверсия находится между <strong>{{interval80[0]}}%</strong> и
                <strong>{{interval80[1]}}%</strong>. Отклонение <strong>±{{interval80[2]}}%</strong></li>
              <li>С вероятностью <strong>70%</strong> конверсия находится между <strong>{{interval70[0]}}%</strong> и
                <strong>{{interval70[1]}}%</strong>. Отклонение <strong>±{{interval70[2]}}%</strong></li>
            </ul>

          </v-card-text>
        </v-card>
      </v-flex>

    </v-layout>
    <v-layout>
      <v-flex class="mt-5">
        <p>
          Вместо кликов и конверсий можно использовать показы и клики соответственно, чтобы считать значения CTR вместо
          конверсии.
        </p>
        <p class="text--secondary caption">
          На самом деле, это не совсем калькулятор статистической занчимости, <code>70%.. 99% = 1 - p</code>, где p
          &mdash; уровень значимости, т.е. он уже нами задан.
          <br/>
          В математической модели используются некоторые допущения, поэтому значения - не истина в последней инстанции.
          Имейте ввиду :)
        </p>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import colormap from 'colormap'
  import {defineComponent, useMeta} from "@nuxtjs/composition-api";
  import {useI18n} from "~/common/composable/i18n";
  import {createHeaders} from "~/common/helpers/seo";


  export default defineComponent({
    name: "StatisticalSignificance",
    setup() {
      const {t} = useI18n()

      useMeta(createHeaders(t('stats_calc_seo_title'), t('stats_calc_seo_description')))
    },
    data: () => ({
      nCount: 0,
      convCount: 0,
      cmap: 0
    }),
    head() {},
    computed: {
      convCoef() {
        return (this.convCount / this.nCount * 100).toFixed(2)
      },
      interval70() {
        return getInterval(this.nCount, this.convCount, 1.036)
      },
      interval80() {
        return getInterval(this.nCount, this.convCount, 1.282)
      },
      interval90() {
        return getInterval(this.nCount, this.convCount, 1.645)
      },
      interval95() {
        return getInterval(this.nCount, this.convCount, 1.96)
      },
      interval99() {
        return getInterval(this.nCount, this.convCount, 2.57)
      },
      percentInt95() {
        return this.interval95[2] > 99.9 ? 99.9 : this.interval95[2];
      },
      colorId95() {
        const coef = 1.7;
        return parseInt(this.percentInt95 * coef > 99 ? 99 : this.percentInt95 * coef);
      }
    },
    watch: {},
    created() {
      const storedData = JSON.parse(localStorage.getItem('stats-calc'));
      for (const key in storedData) {
        this[key] = storedData[key];
      }

      this.cmap = colormap({
        colormap: 'portland',
        nshades: 101,
        format: 'hex',
        alpha: 1
      });

    },
    updated() {
      localStorage.setItem('stats-calc', JSON.stringify(this._data))
    },
    methods: {
      updateConvCoef() {
        this.convCoef = (this.convCount / this.nCount * 100).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
      },
      updateConvCount() {
        this.convCount = (this.convCoef / 100 * this.nCount).toFixed(0)
      },


    },
  })

  function getInterval(n, conv, nSigma) {
    if (parseInt(n) === 0 || !n || !conv) {
      return [0, 0, 0]
    }

    const p = conv / n >= 1 ? 1 : conv / n;
    const std = (n * p * (1 - p)) ** 0.5;
    const mean = n * p;
    let minConv = (mean - std * nSigma) / n;
    const maxConv = (mean + std * nSigma) / n;
    if (minConv < 0) {
      minConv = 0
    }
    return [
      (minConv * 100).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'),
      (maxConv * 100).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'),
      (std * nSigma * 100 / mean).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'),
    ]
  }

</script>

<style scoped>
  .scroll {
    overflow-y: auto;
  }
</style>
