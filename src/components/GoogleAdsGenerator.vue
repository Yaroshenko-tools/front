<template>
	<div>
		<h1 class="title mb-3">Генератор объявлений Google Ads</h1>
		<p>Создайте кампанию в Google AdWords из ключевых слов и масок за 60 секнуд! Утилита генерирует группы объявлений (1 ключ = 1 группа), ключевые слова в выбранных вами типах соответствия и объявления в группе. В объявления можно подставлять ключ или N-ное по счету слово из ключа. Скопируйте результат, вставьте в AdWords Editor. Отлично подойдет, чтобы быстро собрать структуру кампании по маскам или для SKA (Single Keyword Adgroup).</p>
		<v-layout row>
			<v-flex md4>
				<v-textarea
								box
								label="Вставьте сюда ключевые слова"
								:rows="8"
								v-model="keywords"
								class="mb-0"
				/>
				<v-checkbox class="mt-0" v-model="matchtypes.broad" hide-details label="Широкое соответствие"></v-checkbox>
				<v-checkbox v-model="matchtypes.broadMoifier" hide-details label="Модификатор широкого соответствия"></v-checkbox>
				<v-text-field v-if="matchtypes.broadMoifier" v-model="matchtypes.noPluses" label="Не ставить '+' перед словами (через запятую)"></v-text-field>
				<v-checkbox v-model="matchtypes.phrase" hide-details label="Фразовое соответствие"></v-checkbox>
				<v-checkbox v-model="matchtypes.exact" hide-details label="Точное соттвестствие"></v-checkbox>
				<p class="mt-4">Можно задать уникальный URL и/или Заголовок 1 для любого ключа в формате:
					<strong><code>keyword|url|заголовок1</code></strong>
					<br/>
					Только URL: keyword|url<br/>
					Только заголовок: keyword||заголовок1<br/>
				</p>
			</v-flex>
			<v-flex md4>
				<v-expansion-panel expand>
					<v-expansion-panel-content v-for="(ad, index) in ads" :key="index" v-model="ad.open">

						<div slot="header">Объявление {{index + 1}}
							<v-icon v-if="isValidAd(ad)" small color="success">check_circle</v-icon>
							<v-tooltip v-else top>
								<v-icon slot="activator" small color="warning">error</v-icon>
								<span>Не заполнены все обязательные поля. Объявление не будет включено в сгенерированную кампанию</span>
							</v-tooltip>

						</div>
						<v-card>
							<v-card-text class="grey lighten-3">
								<v-text-field label="Заголовок 1 *" v-model="ad.h1" counter="30" placeholder="Например: {KeyWord:[KeyWord]}"/>
								<v-text-field label="Заголовок 2 *" v-model="ad.h2" counter="30" placeholder="Здесь текст второго заголовка"/>
								<v-text-field label="Заголовок 3" v-model="ad.h3" counter="30" placeholder="3-й заголовок не обязателен, но желателен"/>
								<v-textarea rows="2" label="Описание 1 *" v-model="ad.d1" counter="90"/>
								<v-textarea rows="2" label="Описание 2" v-model="ad.d2" counter="90"/>
								<v-layout row>
									<v-flex>
										<v-text-field label="Путь 1" v-model="ad.p1" counter="15"/>
									</v-flex>
									<v-flex class="my-auto">
										<v-icon>/</v-icon>
									</v-flex>
									<v-flex>
										<v-text-field label="Путь 2" v-model="ad.p2" counter="15"/>
									</v-flex>
								</v-layout>
								<v-text-field label="Адрес целевой страницы *" v-model="ad.url" placeholder="https://yaroshenko.tools" type="url"/>
								<a href="#" @click.prevent="deleteAd(index)" class="red--text">Удалить объявление</a>
								<a href="#" @click.prevent="copyAd(index)" class="right">Скопировать объявление</a>
							</v-card-text>
						</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<div class="text-xs-center">
					<v-btn fab small color="blue-grey" class="white--text" @click="addAds()">
						<v-icon>add</v-icon>
					</v-btn>
				</div>
				<div>
					<p class="subheading">Макросы утилиты для объявлений:</p>
					<p>
						<strong>[KeyWord]</strong>, <strong>[Keyword]</strong>, <strong>[keyword]</strong> - подставляют ключевое слово из списка вместо макроса в соответствующем регистре.
					</p>
					<p>
						<strong>[word1]</strong>, <strong>[Word1]</strong>, ..., <strong>[word5]</strong>, <strong>[Word5]</strong> - подставляют выбранное вами по счету слово из ключевого слова из списка вместо макроса в соответствующем регистре.
					</p>
				</div>
			</v-flex>
			<v-flex md4>
				<v-text-field box class="mb-3" label="Название кампании" v-model="campaignName" hint="Если импортируете в уже созданную кампанию, просто скопируйте ее точное название сюда." persistent-hint=""/>
				<v-btn color="success" class="ml-0" @click="getCampaign()" :loading="loading">
					Сгенерировать кампанию
				</v-btn>
				<v-tooltip top>
					<v-btn slot="activator" @click="downloadCsv" :loading="loadingCsv" flat icon>
						<v-icon>cloud_download</v-icon>
					</v-btn>
					<span>Скачать кампанию в формате .CSV</span>
				</v-tooltip>
				<!--<v-btn @click="downloadCsv" color="info" :loading="loadingCsv" >-->
					<!--<v-icon class="mr-1">cloud_download</v-icon> Скачать в .CSV-->
				<!--</v-btn>-->

				<v-tooltip top v-if="campaignHtml">
					<v-btn class="ml-0" slot="activator" @click="copyResult()" flat icon>
						<v-icon>file_copy</v-icon>
					</v-btn>
					<span>Скоприровать кампанию в буфер обмена</span>
				</v-tooltip>
				<h4 class="subheading">Как пользоваться:</h4>
				<ul>
					<li>Заполните нужные поля</li>
					<li>Нажмите «Сгенерировать»</li>
					<li>Скопируйте в буфер</li>
					<li>В меню AdWords Editor: «Аккаунт» -> «Импорт» -> «Вставить текст» (или «Из файла» для скачанной кампании).</li>
					<li>Вставьте скопированный фрагмент туда.</li>
				</ul>

			</v-flex>
		</v-layout>
		<v-layout v-if="campaignHtml">
			<v-card full-width class="elevation-3">
				<v-card-text>
					<v-flex>
						<v-btn class="ml-0" @click="copyResult()">
							<v-icon small class="mr-1">file_copy</v-icon>
							Скопировать кампанию в буфер обмена
						</v-btn>
						<v-btn class="" @click="downloadCsv()" :loading="loadingCsv">
							<v-icon small class="mr-1">cloud_download</v-icon>
							Скачать кампанию в формате .csv
						</v-btn>
						<!--<v-divider class="my-3"/>-->
					</v-flex>
					<v-flex>
						<!--<v-textarea v-model="campaignCsv" full-width outline rows="20"/>-->
						<div class="caption" v-html="campaignHtml"></div>
					</v-flex>
				</v-card-text>
			</v-card>
		</v-layout>
	</div>
</template>

<script>
	// import {CampaignBuilder, Keyword, Ad, BROAD, EXACT, PHRASE} from '../campaignBuilder'
	import axios from 'axios'
	import utils from '../utils'

	// const apiDomain = 'https://api.yaroshenko.tools';
	const apiDomain = 'http://localhost:3000';

	export default {
		name: "GoogleAdsGenerator",
		data: () => ({
			campaignName: '',
			keywords: '',
			ads: [{}, {}, {}],
			matchtypes: {
				broad: false,
				broadMoifier: true,
				noPluses: 'в, на, под, из, с, от, у, и, за',
				phrase: false,
				exact: true,
			},
			campaignCsv: '',
			campaignHtml: '',
			loading: false,
			loadingCsv: false,
		}),
		methods: {
			addAds() {
				this.ads.push({});
			},
			deleteAd(adId) {
				if (confirm('Вы уверены, что хотите удалить это объявление?')) {
					this.ads.splice(adId, 1);
				}
			},
			copyAd(adId) {
				this.ads.push(JSON.parse(JSON.stringify(this.ads[adId])));
			},
			copyResult() {
				utils.copyElementToClipboard('table-result');
			},
			downloadCsv() {
				this.loading = false;
				this.loadingCsv = true;
				axios.post(`${apiDomain}/campaign-generator`, {
					keywords: this.keywords,
					ads: this.ads,
					matchtypes: this.matchtypes,
					campaignName: this.campaignName,
					downloadCsv: true,
					clientDate: new Date(),
				}).then(response => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', `${this.campaignName ? this.campaignName : 'campaign'}.csv`);
					document.body.appendChild(link);
					link.click();
					this.loadingCsv = false;
				})
			},
			getCampaign() {
				this.loading = true;
				this.loadingCsv = false;
				axios.post(`${apiDomain}/campaign-generator`, {
					keywords: this.keywords,
					ads: this.ads,
					matchtypes: this.matchtypes,
					campaignName: this.campaignName,
				}).then(response => {
					// console.log(response.data.campaign)
					this.campaignHtml = response.data.campaign;
					this.loading = false;
				})
			},

		},
		computed: {
			isValidAd() {
				return ad => ad.h1 && ad.h2 && ad.d1 && ad.url
			}
		},

		created() {
			const storedData = JSON.parse(localStorage.getItem('google-ads-generator'));
			for (let key in storedData) {
				this[key] = storedData[key];
			}
		},
		updated() {
			const objectToSave = JSON.parse(JSON.stringify(this._data));
			delete objectToSave.campaignCsv;
			delete objectToSave.campaignHtml;
			delete objectToSave.loading;
			delete objectToSave.loadingCsv;
			localStorage.setItem('google-ads-generator', JSON.stringify(objectToSave))
		},
	}



</script>

<style scoped>

</style>
