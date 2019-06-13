<template>
	<div>
		<!--<div>Index</div>-->
		<v-card class="pa-3">
			<h1>Утилиты для работы с контекстной рекламой</h1>
			<v-list two-line>
				<template v-for="(item, index) in items">
					<div>
						<router-link tag="v-list-tile" :to="item.link">
							<v-list-tile-content>
								<v-list-tile-title><router-link :to="item.link">{{item.title}}</router-link></v-list-tile-title>
								<v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
							</v-list-tile-content>

						</router-link>
					</div>
				</template>
			</v-list>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: "Index",
		data: () => ({
			items: [
				{
					title: 'Генератор UTM-меток',
					subtitle: 'Создайте ссылку с UTM-метками для Google Ads, Яндекс.Директ, VK, Facebook, Instagram и target.mail.ru',
					link: '/utm'
				},
				{
					title: 'Генератор объявлений для Google Ads',
					subtitle: 'Создайте кампанию в Google AdWords из ключевых слов за 60 секнуд! Генерируйте группы и объявления с ключами, на основе заданных ключей и шаболнов объявлений.',
					link: '/google-ads-generator'
				},
				{
					title: 'Калькулятор статистической значимости',
					subtitle: 'Введите число кликов и конверсий (или коэффициент конверсии) и получите интервалы, в которых могут лежать конверсия с вероятностью 70%, 80%, 90%, 95% и 99%',
					link: '/stats-calc'
				},
				{
					title: 'Конвертер типов соответствия ключевых слов для Google Ads',
					subtitle: 'Превратите список ключевых слов в ключи в широком, модификаторе широкого, фразовом и точном соответствии',
					link: '/matchtypes'
				},

				{
					title: 'Утилита, добавляющая к ключам операторы Яндекс.Директ',
					subtitle: 'Добавьте операторы "!" [прямоугольные скобки] и "кавычки" к вашим ключам для Яндекс.Директ',
					link: '/matchtypes-direct'
				}
			]
		}),
	}
</script>

<style scoped>

</style>
