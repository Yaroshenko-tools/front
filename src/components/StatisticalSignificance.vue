<template>
	<div>
		<h1 class="title mb-3">Калькулятор статистической значимости</h1>
		<p class="mb-0">Введите число кликов и конверсий (или показов и кликов для CTR) и получите интервалы, в которых могут лежать эти значения с вероятностью 80, 90, 95 и 99%</p>
		<v-layout row>
			<v-flex class="" xs4 sm4 md4>
				<v-text-field v-model="nCount" type="number" label="Число кликов (или показов, для CTR)"></v-text-field>
				<v-text-field v-model="convCount" type="number" label="Число конверсий (или кликов, для CTR)"></v-text-field>
				<v-text-field v-model="convCoef" suffix="%" type="number" label="Коэфициент конверсии в % (или CTR)"></v-text-field>
			</v-flex>
			<v-flex class="" xs8 sm8 md8>
				<v-card>
					<v-card-text>
						<h3>С вероятностью</h3>
						<ul>
							<li>80% &mdash; конверсия находится между <strong>{{interval80[0]}}%</strong> и <strong>{{interval80[1]}}%</strong></li>
							<!--<li>90% &mdash; конверсия находится между <strong>{{interval90[0]}}%</strong> и <strong>{{interval90[1]}}%</strong></li>-->
							<li>95% &mdash; конверсия находится между <strong>{{interval95[0]}}%</strong> и <strong>{{interval95[1]}}%</strong></li>
							<li>99% &mdash; конверсия находится между <strong>{{interval99[0]}}%</strong> и <strong>{{interval99[1]}}%</strong></li>
						</ul>
					</v-card-text>
				</v-card>
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
			interval80() {
				return getInterval(this.nCount, this.convCoef / 100, 1.282)

			},
			interval90() {
				return getInterval(this.nCount, this.convCoef / 100, 1.645)
			},
			interval95() {
				return getInterval(this.nCount, this.convCoef / 100, 1.96)
			},
			interval99() {
				return getInterval(this.nCount, this.convCoef / 100, 2.57)
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
		methods: {},
		watch: {
			convCount(value) {
				this.convCoef = ((value / this.nCount) * 100).toFixed(2)
			},
			convCoef(value) {
				this.convCount = (this.nCount * (value / 100)).toFixed(0)
			}

		},
	}

	function getInterval(n, p, nSigma) {
		let std = (n * p * (1 - p)) ** 0.5;
		let mean = n * p;
		let minConv = (mean - std * nSigma) / n;
		let maxConv = (mean + std * nSigma) / n;
		return [(minConv * 100).toFixed(2), (maxConv * 100).toFixed(2)]
	}
</script>

<style scoped>
	.scroll {
		overflow-y: auto;
	}
</style>
