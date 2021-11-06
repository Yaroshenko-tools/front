import Vue from 'vue'
import Router from 'vue-router'
import UtmGenerator from './components/UtmGenerator'
import Matchtypes from './components/Matchtypes'
import MatchtypesDirect from './components/MatchtypesDirect'
import GoogleAdsGenerator from './components/GoogleAdsGenerator'
import StatisticalSignificance from './components/StatisticalSignificance'
import Index from './components/Index'

Vue.use(Router);

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '',
			name: 'Index',
			component: Index,
			meta: {
				title: 'Утилиты для работы с контекстной рекламой от Алексея Ярошенко',
				description: 'Бесплатные утилиты и сервисы, которые в ускоряют запуск рекламной кампании в Яндекс.Директ и Google Adwords в 2-10 раз!'
			},

		},
		{
			path: '/utm',
			name: 'UtmGenerator',
			component: UtmGenerator,
			meta: {
				title: 'Генератор UTM-меток для AdWords, Директ, VK, Facebook, Instagram',
				description: 'Создайте ссылку с продвинутыми UTM-метками для Яндекс Директ, Google Adwords, VK, Facebook или Instagram за 15 секунд. Утилита поможет!'
			}
		},
		{
			path: '/matchtypes',
			name: 'Matchtypes',
			component: Matchtypes,
			meta: {
				title: 'Утилита для работы с типами соответствия Google Ads',
				description: 'Утилита конвертирует ключевые слова в любой из 3-х типов соответствия Google AdWords: широкое соответствие, фразовое соответствие и точное соответствие.'
			}
		},
		{
			path: '/google-ads-generator',
			name: 'GoogleAdsGenerator',
			component: GoogleAdsGenerator,
			meta: {
				title: 'Генератор объявлений Google Ads',
				description: 'Сгенерируйте кампани, группы объявлений, ключи в разных типах соответствия и объявления в Google Ads за 60 секунд!'
			}
		},
		{
			path: '/stats-calc',
			name: 'StatisticalSignificance',
			component: StatisticalSignificance,
			meta: {
				title: 'Калькулятор статистической значимости',
				description: 'Введите число кликов и конверсий (или коэффициент конверсии) и получите интервалы, в которых могут лежать конверсия с вероятностью 70%, 80%, 90%, 95% и 99%'
			}
		},
		{
			path: '/matchtypes-direct',
			name: 'MatchtypesDirect',
			component: MatchtypesDirect,
			meta: {
				title: 'Утилита для добавления операторов Яндекс.Директ к ключам',
				description: 'Утилита добавляет операторы !восклицательный !знак, "кавычки" и [прямоугольные скобки], фиксирующие словоформу, число слов и их порядок к ключевым словам для Яндекс.Директ.'
			}
		},
    {
      path: '*',
      component: () => import('@/components/NotFound'),
      meta: {
        title: 'Страница не найдена (404)',
        description: 'Вернитесь на главную и повторите запрос снова'
      },
    }
	],
});

router.beforeEach((to, from, next) => {
	document.title = to.meta.title;
	const metaDescription = document.head.querySelector("[name=description]");
	if (metaDescription) {
		metaDescription.setAttribute('content', to.meta.description);
	}
	next()
});

export default router;
