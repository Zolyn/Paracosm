import { defineThemeConfig } from "./theme/functions";
import { generatePaginationPages, getPosts } from "./theme/serverUtils";

const getConfig = async () => {
    const pageSize = 3;
    await generatePaginationPages(pageSize);
    return defineThemeConfig({
        title: 'Paracosm',
        base: '/',
        outDir: './dist',
        description: 'A harbor for a pessimist.',
        themeConfig: {
            posts: await getPosts(),
            website: 'https://blog.zorin.icu',
            nav: [
                { text: 'Home', link: '/' },
                { text: 'Archives', link: '/pages/archives' },
                { text: 'Tags', link: '/pages/tags' },
                { text: 'About', link: '/pages/about' }
            ],
            socialLinks: [
                {
                    icon: 'github',
                    link: 'https://github.com/Zolyn'
                }
            ]
        },
    })
}

export default getConfig()
