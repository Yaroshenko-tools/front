<template>
	<div>
		<h1 class="title mb-3">Генератор объявлений Google Ads</h1>
		<p>Создайте кампанию в Google AdWords из ключевых слов и масок за 60 секнуд! Утилита генерирует группы объявлений, ключевые слова и до 2 объявлений в группе. Скопируйте результат, вставьте в AdWords Editor. Отлично подойдет, чтобы быстро собрать структуру кампании по маскам или для SKA (Single Keyword Adgroup).</p>
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
			</v-flex>
			<v-flex md4>
				<v-expansion-panel>
					<v-expansion-panel-content v-for="(ad, index) in ads" :key="index" v-model="ad.open">

						<div slot="header">Объявление {{index + 1}}
							<v-icon v-if="isValidAd(ad)" small color="success">check_circle</v-icon>
							<v-tooltip v-else top>
								<v-icon slot="activator" small color="warning">error</v-icon>
								<span>Не заполнены все обязательные поля</span>
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
				<v-btn color="success" class="ml-0" @click="getCampaign()">
					<v-icon></v-icon>
					Сгенерировать кампанию
				</v-btn>
				<v-tooltip top v-if="campaignCsv">
					<v-btn slot="activator" @click="downloadCsv" flat icon>
						<v-icon>cloud_download</v-icon>
					</v-btn>
					<span>Скачать кампанию в формате .CSV</span>
				</v-tooltip>

				<v-tooltip top v-if="campaignCsv">
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
		<v-layout v-if="campaignCsv">
			<v-card>
				<v-card-text>
					<v-btn class="ml-0" @click="copyResult()">
						<v-icon small class="mr-1">file_copy</v-icon>
						Скопировать кампанию в буфер обмена
					</v-btn>
					<v-btn class="" @click="downloadCsv()">
						<v-icon small class="mr-1">cloud_download</v-icon>
						Скачать кампанию в формате .csv
					</v-btn>
					<v-divider class="my-3"/>
					<pre style="overflow: scroll">{{campaignCsv}}</pre>
				</v-card-text>
			</v-card>
		</v-layout>
	</div>
</template>

<script>
	import {CampaignBuilder, Keyword, Ad, BROAD, EXACT, PHRASE} from '../campaignBuilder'


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
				this.$copyText(this.campaignCsv)
			},
			downloadCsv() {
				let name = this.campaignName || 'google-ads-campaign';
				name = name + '.csv';
				downloadText(name, this.campaignCsv)
			},
			getCampaign() {

				const campaign = new CampaignBuilder(this.campaignName);
				let keywords = this.keywords.split("\n");
				console.log(keywords)
				for (let i = 0; i < keywords.length; i++) {
					let keyword = keywords[i].trim();
					keyword = replaceAll(keyword, '\\+', '');
					keyword = replaceAll(keyword, '\\-', '');
					keyword = replaceAll(keyword, '\\[', '');
					keyword = replaceAll(keyword, '\\]', '');
					keyword = replaceAll(keyword, '\\"', '');
					keyword = replaceAll(keyword, '\\"', '');
					keyword = keyword.replace(/ +(?= )/g, '');

					if (keyword) {
						// Start building campaign here

						console.log(keyword)
						campaign.startAdGroup(keyword)

						for (let j = 0; j < this.ads.length; j++) {
							if (this.isValidAd(this.ads[j])) {
								campaign.addAd(new Ad(this.ads[j], keyword));
							}
						}

						if (this.matchtypes.broad) {
							campaign.addKeyword(new Keyword(keyword, BROAD));
						}

						if (this.matchtypes.broadMoifier) {
							const POSTFIX = 'ZZZXXXAAASSSLLLKKKJJJQQQ'
							let broadModifierKeyword = '+' + replaceAll(keyword, ' ', ' +') + POSTFIX;
							let noPluses = this.matchtypes.noPluses;
							noPluses = replaceAll(noPluses, ' ', '').split(',').filter(item => item !== '');
							console.log(noPluses)
							for (let n in noPluses) {
								broadModifierKeyword = replaceAll(broadModifierKeyword, '\\+' + noPluses[n] + ' ', noPluses[n] + ' ');
								broadModifierKeyword = replaceAll(broadModifierKeyword, '\\+' + noPluses[n] + POSTFIX, noPluses[n] + POSTFIX);
							}
							broadModifierKeyword = broadModifierKeyword.replace(POSTFIX, '');
							campaign.addKeyword(new Keyword(broadModifierKeyword, BROAD));
						}
						if (this.matchtypes.phrase) {
							campaign.addKeyword(new Keyword(keyword, PHRASE));
						}
						if (this.matchtypes.exact) {
							campaign.addKeyword(new Keyword(keyword, EXACT));
						}
						this.campaignCsv = campaign.getCsv();
					}
				}
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
			localStorage.setItem('google-ads-generator', JSON.stringify(objectToSave))
		},
	}

	function replaceAll(target, search, replacement) {
		if (!target) {
			return ''
		} else {
			return target.replace(new RegExp(search, 'g'), replacement);
		}
	}

	function downloadText(filename, text) {
		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

</script>

<style scoped>

</style>
