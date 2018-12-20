<template>
	<div>
		<h1 class="title mb-3">Утилита, добавляющая к ключам операторы Яндекс.Директ</h1>
		<p class="mb-0">Добавьте операторы "кавычки", !восклицательный !знак и [квадратные скобки], чтобы зафиксировать число слов, словоформу или порядок слов для Яндекс.Директ</p>
		<v-layout row>
			<v-flex class="pt-0 pb-0" xs12 sm6 md6>
				<v-checkbox v-model="noOperators" hide-details label="Ничего не фиксировать"></v-checkbox>
				<v-checkbox v-model="quotes" hide-details label='"Зафиксировать число слов"'></v-checkbox>
				<v-checkbox v-model="quotesAndExact" hide-details label='"!Зафиксировать !число !слов !и !словоформу"'></v-checkbox>
			</v-flex>
			<v-flex class="pt-0 pb-0" xs12 sm6 md6>
				<v-checkbox v-model="brackets" hide-details label="[Зафиксировать порядок слов]"></v-checkbox>
				<v-checkbox v-model="quotesAndBrackets" hide-details label='"[Зафиксировать порядок и число слов]"'></v-checkbox>
				<v-checkbox v-model="quotesBracketsAndExact" hide-details label='"[!Зафиксировать !порядок !число !слов !и !словоформу]"'></v-checkbox>

			</v-flex>
		</v-layout>


		<v-layout row>
			<v-flex xs12 sm6 md6>
				<v-textarea class="" v-model="keywords" rows="12" box label="Скопируйте сюда ключевые слова, каждое с новой строки"></v-textarea>
			</v-flex>
			<v-flex xs12 sm6 md6>
				<!--<v-textarea box v-model="result" rows="10" label="Здесь появится результат" id="result"></v-textarea>-->
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
		name: "MatchtypesDirect",
		data: () => ({
			noOperators: true,
			quotes: true,
			brackets: false,
			quotesAndBrackets: false,
			quotesAndExact: true,
			quotesBracketsAndExact: false,
			keywords: '',
		}),
		computed: {
			result() {
				let keywords = this.keywords.split("\n");
				let result = '';
				const postfix = 'XXYYCC';
				for (let i in keywords) {
					let keyword = keywords[i].trim()
					// .replaceAll('\\+', '')
						.replaceAll('\\-', '')
						.replaceAll('\\[', '')
						.replaceAll('\\]', '')
						.replaceAll('\\"', '')
						.replace(/ +(?= )/g, '');
					//
					if (keyword) {
						let exactKeyword = '\!' + keyword.replaceAll('\\+', '').replaceAll(' ', ' \!');
						let keywordNoPluses = keyword.replaceAll('\\+', '');
						if (this.noOperators) {
							result = result + `<div class="grey--text text--darken-4">${keyword}</div>`;
						}
						if (this.quotes) {
							result = result + `<div class="red--text text--darken-4">\"${keywordNoPluses}\"</div>`;
						}
						if (this.brackets) {
							result = result + `<div class="blue--text text--darken-3">\[${keyword}\]</div>`;
						}
						if (this.quotesAndBrackets) {
							result = result + `<div class="blue--text text--darken-4">\"\[${keywordNoPluses}\]\"</div>`;
						}
						if (this.quotesAndExact) {
							result = result + `<div class="green--text text--darken-3">\"${exactKeyword}\"</div>`;
						}
						if (this.quotesBracketsAndExact) {
							result = result + `<div class="green--text text--darken-4">\"\[${exactKeyword}\]\"</div>`;
						}
					}
				}
				return result;
			},
		},
		created() {
			const storedData = JSON.parse(localStorage.getItem('matchtypes-direct'));
			for (let key in storedData) {
				this[key] = storedData[key];
			}
		},
		updated() {
			localStorage.setItem('matchtypes-direct', JSON.stringify(this._data))
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
