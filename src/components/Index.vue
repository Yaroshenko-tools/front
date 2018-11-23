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
								<v-list-tile-title v-html="item.title"></v-list-tile-title>
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
					title: 'Конвертер типов соответствия ключевых слов для Google Ads',
					subtitle: 'Превратите список ключевых слов в ключи в широком, модификаторе широкого, фразовом и точном соответствии',
					link: '/matchtypes'
				}
			]
		}),
	}
</script>

<style scoped>

</style>
