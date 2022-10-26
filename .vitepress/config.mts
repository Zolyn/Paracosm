import { defineThemeConfig } from "./theme/functions";
import { generatePaginationPages, getPosts } from "./theme/serverUtils";
import { sidebar } from './sidebar'
import { nav } from './nav'

const getConfig = async () => {
    const pageSize = 3;
    await generatePaginationPages(pageSize);
    return defineThemeConfig({
        title: 'Paracosm',
        lang: 'zh-CN',
        base: '/',
        outDir: './dist',
        lastUpdated: true,
        cleanUrls: 'with-subfolders',
        description: 'A harbor for a pessimist.',
        head: [
            ['link', { rel: 'icon', href: 'https://bu.dusays.com/2022/10/11/63458aaaae4aa.png' }]
        ],
        themeConfig: {
            posts: await getPosts(),
            website: 'https://blog.zorin.icu',
            outline: [2,3],
            outlineTitle: 'Toc',
            editLink: {
                pattern: 'https://github.com/Zolyn/Paracosm/edit/main/:path',
                text: 'Edit this page on GitHub'
            },
            socialLinks: [
                {
                    icon: 'github',
                    link: 'https://github.com/Zolyn'
                }
            ],
            footer: {
                message: 'MIT and CC BY-NC-SA 4.0 Licensed',
                copyright: 'Copyright © 2020-PRESENT Yumeoto Zorin'
            },
            nav,
            sidebar,
            pageSize,
        },
        vite: {
            server: {
                host: '0.0.0.0'
            }
        }
    })
}

export default getConfig()
