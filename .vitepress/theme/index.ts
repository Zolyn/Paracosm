import DefaultTheme from 'vitepress/theme'

import Archives from './components/Archives.vue'
import Tags from './components/Tags.vue'
import Page from './components/Page.vue'

import './custom.css'
import type { EnhanceAppContext } from 'vitepress'

export default {
    ...DefaultTheme,
    enhanceApp({ app }: EnhanceAppContext) {
        // register global compoment
        app.component('Tags', Tags)
        app.component('Archives', Archives)
        app.component('Page', Page)
    }
}
