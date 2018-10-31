<template>
	<div>

		<h1 class="title mb-4">Генератор UTM-меток</h1>
		<div>Выберите источник трафика или заполните поля вручную:</div>

		<v-btn class="ml-0" small outline @click="setTrafficSource('adwords')">Google Ads</v-btn>
		<v-btn class="ml-0" small outline @click="setTrafficSource('direct')">Яндекс.Директ</v-btn>
		<v-btn class="ml-0" small outline @click="setTrafficSource('vk')">VK.com</v-btn>
		<v-btn class="ml-0" small outline @click="setTrafficSource('fb')">Facebook</v-btn>
		<v-btn class="ml-0" small outline @click="setTrafficSource('instagram')">Instagram</v-btn>
		<v-btn class="ml-0" small outline @click="setTrafficSource('mytarget')">Target.mail.ru</v-btn>
		<v-btn class="ml-0" color="error" small outline @click="setTrafficSource('reset')">Сброс</v-btn>

		<v-text-field
						v-model="url"
						label="URL"
						placeholder="Вставьте сюда ссылку на сайт или целевую страницу. Например: https://yaroshenko.tools"
		></v-text-field>
		<!--<v-flex xs12 sm6 md8 offset-md5 > asd</v-flex>-->
		<v-layout row>
			<v-flex xs12 sm6 md6>

				<v-text-field
								v-model="params.utm_source"
								label="utm_source *"
								placeholder="Источника трафика. Например, google"
				></v-text-field>


				<v-text-field
								v-model="params.utm_medium"
								label="utm_medium *"
								placeholder="Тип трафика. Например: cpc, email, banner"
				></v-text-field>

				<v-text-field
								v-model="params.utm_campaign"
								label="utm_campaign *"
								placeholder="Рекламная кампания: например, google-poisk"
				></v-text-field>

				<v-text-field
								v-model="params.utm_content"
								label="utm_content"
								placeholder="Например, cpc, email, banner"
				></v-text-field>

				<v-text-field
								v-model="params.utm_term"
								label="utm_term"
								placeholder="Ключевое слово. Например, макрос {keyword}"
				></v-text-field>
			</v-flex>
			<v-flex xs12 sm6 md6>
				<v-textarea
								box
								label="Ссылка с UTM-меткой появится здесь"
								v-model="result"
								readonly
				></v-textarea>
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
		name: "UtmGenerator",
		data: () => ({
			trafficSource: '',
			url: '',
			params: {
				utm_source: '',
				utm_medium: '',
				utm_campaign: '',
				utm_content: '',
				utm_term: '',
			},

		}),
		computed: {
			result() {
				let url = this.url.trim().toLowerCase();
				if (!url.startsWith('http://') && !url.startsWith('https://')) {
					url = 'https://' + url;
				}
				if(this.url.trim() && (url.match(new RegExp('/', "g")) || []).length < 3) {
					url = url + '/';
				}
				return addParamsToUrl(url, this.params)
			},
		},
		created() {
			const storedData = JSON.parse(localStorage.getItem('utm'));
			for (let key in storedData) {
				this[key] = storedData[key];
			}
		},
		updated() {
			localStorage.setItem('utm', JSON.stringify(this._data))
		},
		methods: {
			copyResult() {
				this.$copyText(this.result)
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
						utm_content: '{creative_id}',
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
					};
					this.url = '';
				}
			}
		},
	}

	const addParamsToUrl = (url, params) => {
		const firstSeperator = (url.indexOf('?') === -1 ? '?' : '&');
		const queryStringParts = [];
		let isParamExists = false;
		for (let key in params) {
			let value = params[key];
			if (value) {
				if (
					(value.trim().charAt(0) === '{' || value.trim().charAt(value.length - 1) === '}') ||
					(value.trim().charAt(0) === '[' || value.trim().charAt(value.length - 1) === ']')
				) {
					value = value.trim()
				} else {
					value = encodeURIComponent(value.trim())
				}
				isParamExists = true;
				queryStringParts.push(key + '=' + value);
			}
		}
		const queryString = queryStringParts.join('&');
		return url + (isParamExists ? firstSeperator : '') + queryString;
	}
</script>

<style scoped>

</style>
