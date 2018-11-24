<template>
	<v-app>
		<v-navigation-drawer  fixed clipped app temporary v-model="drawer" right dark >
			<v-list>
				<v-list-tile>
					<!--<v-list-tile-action>-->
						<!--<v-btn icon @click.stop="mini = !mini">-->
							<!--<v-icon v-html="chevronIcon"></v-icon> -->
						<!--</v-btn>-->
					<!--</v-list-tile-action>-->
					<v-list-tile-content></v-list-tile-content>
				</v-list-tile>
				<v-list-tile class="" active-class="green" v-for="(item, i) in items" :key="i" :to="item.to">
					<v-list-tile-action>
							<v-icon v-html="item.icon"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="item.title"></v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar  fixed app clipped-left class="">
			<router-link to="/" tag="v-toolbar-title" class="pointer">
				<!--<v-toolbar-title>-->
				<!--<v-icon color="blue">	</v-icon>-->
				<v-toolbar-side-icon>
					<img :src="logo" class="logo"/>
				</v-toolbar-side-icon>
				Yaroshenko.Tools
				<!--</v-toolbar-title>-->

			</router-link>
			<v-toolbar-title>
				<!--<span class="text&#45;&#45;disabled"> бесплатные утилиты для работы с контекстной рекламой</span>-->
			</v-toolbar-title>


			<v-spacer></v-spacer>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<!--<v-toolbar-side-icon @click.stop="mini = !mini"></v-toolbar-side-icon>-->
			<!--<v-toolbar-side-icon @click.stop="mini = !mini"></v-toolbar-side-icon>-->

		</v-toolbar>
		<v-content>
			<v-container fluid grid-list-xl class="white">
				<router-view/>
				<div class="mt-4 text--disabled">
					<span>&copy; 2018 Алексей Ярошенко. Хотите что-то добавить, предложить новую утилиту или нашли баг? Напишите в группу в телеграмме <a href="https://t.me/yaroshenko_tools" target="_blank">@yaroshenko_tools</a></span>
				</div>
			</v-container>
		</v-content>

		<!--<v-footer class="pa-3 elevation-3" app fixed>-->
		<!--</v-footer>-->
	</v-app>
</template>

<script>
	import logo from "./assets/logo-tools.png"

	export default {
		data() {
			return {
				drawer: false,
				mini: true,
				logo: logo,
				items: [
					{
						icon: 'list',
						title: 'Все утилиты',
						to: '/'
					},
					{
						icon: 'link',
						title: 'Генератор UTM-меток',
						to: '/utm'
					},
					{
						icon: 'compare_arrows',
						title: 'Конвертер типов соответствия Google Ads',
						to: '/matchtypes'
					},
					{
						icon: 'dvr',
						title: 'Генератор объявлений Google Ads',
						to: '/google-ads-generator'
					},
				],
			}
		},
		computed: {
			chevronIcon() {
				return this.mini ? 'chevron_right' : 'chevron_left'
			},
		},
		created() {
			fetch('/').then(res => console.log('ajax test'));
		},
		name: 'App'
	}
</script>
<style>
	.logo {
		height: 32px;
		width: 32px;
		-webkit-transition: -webkit-transform 10s linear;
		transition: transform 10s linear;
		/*filter: invert(100%);*/
	}

	.logo:hover {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}

	.pointer {
		cursor: pointer;
	}

	.nowrap {
		white-space: nowrap;
	}
</style>
