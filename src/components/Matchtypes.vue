<template>
	<div>
		<h1 class="title mb-3">Конвертер типов соответствия ключевых слов Google Ads</h1>
		<p class="mb-0">Утилита конвертирует ключевые слова в любой из 4-х типах соответствия Google AdWords: широкое соответствие, модификатор широкого соответствия, фразовое соответствие и точное соответствие.</p>
		<v-layout row>
			<v-flex class="pt-0 pb-0" xs12 sm6 md6>
				<v-checkbox v-model="broad" hide-details label="Широкое соответствие"></v-checkbox>
				<v-checkbox v-model="broadMoifier" hide-details label="Модификатор широкого соответствия"></v-checkbox>
				<v-text-field v-if="broadMoifier" v-model="noPluses" label="Не ставить '+' перед словами и предлогами (через запятую)"></v-text-field>

			</v-flex>
			<v-flex class="pt-0 pb-0" xs12 sm6 md6>
				<v-checkbox v-model="phrase" hide-details label="Фразовое соответствие"></v-checkbox>
				<v-checkbox v-model="exact" hide-details label="Точное соттвестствие"></v-checkbox>

			</v-flex>
		</v-layout>


		<v-layout row>
			<v-flex xs12 sm6 md6>
				<v-textarea v-model="keywords" rows="10" box label="Скопируйте сюда ваши ключевые слова"></v-textarea>
			</v-flex>
			<v-flex xs12 sm6 md6>
				<v-textarea box v-model="result" rows="10" label="Здесь появится результат"></v-textarea>
				<v-btn class="success ml-0" @click="copyResult">
					<v-icon small>file_copy</v-icon>&nbsp;
					Copy to clipboard
				</v-btn>
			</v-flex>

		</v-layout>
	</div>
</template>

<script>
	export default {
		name: "Matchtypes",
		data: () => ({
			broad: false,
			broadMoifier: true,
			phrase: false,
			exact: true,
			keywords: '',
			noPluses: 'в, на, под, из, с, от, у, и, за'
		}),
		computed: {
			result() {
				let keywords = this.keywords.split("\n");
				let result = '';
				const postfix = 'XXYYCC';
					for (let i in keywords) {
					let keyword = keywords[i].trim()
						.replaceAll('\\+', '')
						.replaceAll('\\-', '')
						.replaceAll('\\[', '')
						.replaceAll('\\]', '')
						.replaceAll('\\"', '')
						.replace(/ +(?= )/g,'');

					if(keyword) {
						if (this.broad) {
							result = result + keyword + "\n";
						}
						if (this.broadMoifier) {

							let broadModifierKeyword = '+' + keyword.replaceAll(' ', ' +') + postfix;
							let noPluses = this.noPluses.replaceAll(' ', '').split(',').filter(item => item !== '');
							console.log(noPluses)
							for (let n in noPluses) {
								broadModifierKeyword = broadModifierKeyword.replaceAll('\\+' + noPluses[n] + ' ', noPluses[n] + ' ');
								broadModifierKeyword = broadModifierKeyword.replaceAll('\\+' + noPluses[n] + postfix, noPluses[n] + postfix);
							}
							broadModifierKeyword = broadModifierKeyword.replace(postfix, '');
							result = result + broadModifierKeyword + "\n";
						}
						if (this.phrase) {
							result = result + '"' + keyword + '"' + "\n";
						}
						if (this.exact) {
							result = result + '[' + keyword + ']' + "\n";
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
				this.$copyText(this.result)
			},
		},
	}
	String.prototype.replaceAll = function (search, replacement) {
		let target = this;
		return target.replace(new RegExp(search, 'g'), replacement);
	};
</script>

<style scoped>

</style>
