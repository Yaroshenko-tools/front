import Vue from 'vue'
import Vuetify, {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VBtn,
  VCard,
  VCardText,
  VCheckbox,
  VCol,
  VContent,
  VContainer,
  VDivider,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelContent,
  VExpansionPanelHeader,
  VFlex,
  VIcon,
  VLayout,
  VList,
  VListItem,
  VListItemAction,
  VListItemContent,
  VListItemTitle,
  VListItemSubtitle,
  VNavigationDrawer,
  VProgressCircular,
  VRow,
  VSnackbar,
  VSpacer,
  VTextField,
  VTextarea,
  VToolbar,
  VToolbarTitle,
  VTooltip,
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VBtn,
    VCard,
    VCardText,
    VCheckbox,
    VCol,
    VContent,
    VContainer,
    VDivider,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelContent,
    VExpansionPanelHeader,
    VFlex,
    VIcon,
    VLayout,
    VList,
    VListItem,
    VListItemAction,
    VListItemContent,
    VListItemTitle,
    VListItemSubtitle,
    VNavigationDrawer,
    VProgressCircular,
    VRow,
    VSnackbar,
    VSpacer,
    VTextField,
    VTextarea,
    VToolbar,
    VToolbarTitle,
    VTooltip,
  },
})

const opts = {
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#1976d2',
      },
      dark: {
        primary: '#1976d2'
      },
    },
  },
  options: {
    customProperties: true,
  },
  icons: {
    iconfont: 'md', // default is 'mdi'
  },
}

export default new Vuetify(opts)
