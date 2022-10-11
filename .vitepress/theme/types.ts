import { DefaultTheme } from "vitepress";
import { Post } from './functions'

export interface ThemeConfig extends DefaultTheme.Config {
    posts: Post[]
    website: string
    pageSize: number
}
