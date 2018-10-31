import Vue from 'vue'
import Router from 'vue-router'
import UtmGenerator from './components/UtmGenerator'
import Matchtypes from './components/Matchtypes'
import Index from './components/Index'
Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
	    meta: {
		    title: 'Утилиты для работы с трафиком'
	    },

    },
	  {
		  path: '/utm',
		  name: 'UtmGenerator',
		  component: UtmGenerator,
		  meta: {
			  title: 'Генератор UTM-меток для AdWords, Директ, VK, Facebook, Instagram'
		  }
	  },
	  {
		  path: '/matchtypes',
		  name: 'Matchtypes',
		  component: Matchtypes,
		  meta: {
			  title: 'Утилита для работы с типами соответствия Google AdWords'
		  }
	  },
  ],

});

router.beforeEach((to, from, next) => {
	document.title = to.meta.title;
	next()
});

export default router;
