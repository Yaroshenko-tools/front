<template>
	<div>
		<h1 class="title mb-3">Калькулятор статистической значимости</h1>
		<p class="mb-0">Введите число кликов и конверсий (или коэффициент конверсии) и получите интервалы, в которых может лежать конверсия с вероятностью 70%, 80%, 90%, 95% и 99%</p>
		<v-layout>
			<v-flex class="" xs12 sm12 md5>
				<v-text-field v-model="nCount" type="number" label="Число кликов" v-on:change="updateConvCoef()"></v-text-field>
				<v-layout row>
					<v-flex>
						<v-text-field v-model="convCount" type="number" label="Число конверсий" v-on:change="updateConvCoef()"></v-text-field>
					</v-flex>
					<v-flex class="mt-4">или</v-flex>
					<v-flex>
						<v-text-field v-model="convCoef" suffix="%" type="number" label="Коэфициент конверсии" v-on:change="updateConvCount()"></v-text-field>
					</v-flex>
				</v-layout>
			</v-flex>
			<v-flex class="" xs12 sm12 md7>
				<v-card>
					<v-card-text>
						<h3 class="mb-2">Вот насколько значимые получились результаты:</h3>
						<ul>
							<li>С вероятностью <strong>70%</strong> конверсия находится между <strong>{{interval70[0]}}%</strong> и <strong>{{interval70[1]}}%</strong>. Отклонение <strong>±{{interval70[2]}}%</strong></li>
							<li>С вероятностью <strong>80%</strong> конверсия находится между <strong>{{interval80[0]}}%</strong> и <strong>{{interval80[1]}}%</strong>. Отклонение <strong>±{{interval80[2]}}%</strong></li>
							<li>С вероятностью <strong>90%</strong> конверсия находится между <strong>{{interval90[0]}}%</strong> и <strong>{{interval90[1]}}%</strong>. Отклонение <strong>±{{interval90[2]}}%</strong></li>
							<li>С вероятностью <strong>95%</strong> конверсия находится между <strong>{{interval95[0]}}%</strong> и <strong>{{interval95[1]}}%</strong>. Отклонение <strong>±{{interval95[2]}}%</strong></li>
							<li>С вероятностью <strong>99%</strong> конверсия находится между <strong>{{interval99[0]}}%</strong> и <strong>{{interval99[1]}}%</strong>. Отклонение <strong>±{{interval99[2]}}%</strong></li>
						</ul>

						<!--<v-progress-circular-->
						<!--:rotate="360"-->
						<!--:size="255"-->
						<!--:width="3"-->
						<!--:value="70"-->
						<!--color="red"-->
						<!--&gt;<strong>{{interval70[0]}}%</strong> < Cv < <strong>{{interval70[1]}}%</strong>-->
						<!--</v-progress-circular>-->
					</v-card-text>
				</v-card>
			</v-flex>

		</v-layout>
		<v-layout>
			<v-flex class="mt-5">
				<p>
					На самом деле, это не совсем калькулятор статистической занчимости, ибо сама статистическая занчимость здесь явно не фигурирует.
					<br/>
					В математической модели используются некоторые допущения, поэтому значения - не истина в последней инстанции. Имейте ввиду :)
				</p>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
	import utils from '../utils'

	export default {
		name: "StatisticalSignificance",
		data: () => ({
			nCount: 0,
			convCount: 0,
			convCoef: 0,

		}),
		computed: {
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
			}
		},
		created() {
			const storedData = JSON.parse(localStorage.getItem('stats-calc'));
			for (let key in storedData) {
				this[key] = storedData[key];
			}
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
			}
		},
		watch: {},
	}

	function getInterval(n, conv, nSigma) {
		if (parseInt(n) === 0 || !n || !conv) {
			return [0 , 0, 0]
		}

		let p = conv / n;
		let std = (n * p * (1 - p)) ** 0.5;
		let mean = n * p;
		let minConv = (mean - std * nSigma) / n;
		let maxConv = (mean + std * nSigma) / n;
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
