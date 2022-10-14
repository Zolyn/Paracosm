import { globby } from 'globby'
import matter from 'gray-matter'
import fs from 'fs-extra'
import path from 'path'
import { Post } from './functions'

export async function getPosts(): Promise<Post[]> {
    let paths = await getPostMDFilePaths()
    let posts = await Promise.all(
        paths.map(async (item) => {
            const content = await fs.readFile(item, 'utf-8')
            const { data } = matter(content)
            data.date = _convertDate(data.date)
            return {
                frontMatter: data as Post['frontMatter'],
                regularPath: `/${item.replace('.md', '')}`
            }
        })
    )
    posts.sort(_compareDate)
    return posts
}

export async function generatePaginationPages(pageSize: number) {
    // getPostMDFilePath return type is object not array
    let allPagesLength = [...(await getPostMDFilePaths())].length

    //  pagesNum
    let pagesNum = allPagesLength % pageSize === 0 ? allPagesLength / pageSize : allPagesLength / pageSize + 1
    pagesNum = parseInt(pagesNum.toString())

    const paths = path.resolve('./')
    if (allPagesLength > 0) {
        for (let i = 1; i < pagesNum + 1; i++) {
            const page = `
---
date: 2021-06-30
title: ${i === 1 ? 'Home' : 'Page_' + i}
sidebar: false
---
<script setup>
import Page from "${i === 1 ? '.' : '..'}/.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const pageSize = theme.value.pageSize;
const posts = theme.value.posts.slice(${pageSize * (i - 1)},${pageSize * i})
</script>
<Page :posts="posts" :pageCurrent="${i}" :pagesNum="${pagesNum}" />
`.trim()
            const file = paths + (i === 1 ? '/index.md' : `/pages/${i}.md`)
            await fs.writeFile(file, page)
        }
    }
}

function _convertDate(date = new Date().toString()) {
    const json_date = new Date(date).toJSON()
    return json_date.split('T')[0]
}

function _compareDate(obj1: Post, obj2: Post) {
    return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1
}

export async function getPostMDFilePaths() {
    let paths = await globby(['**.md'], {
        ignore: ['node_modules', 'README.md']
    })
    return paths.filter((item) => item.includes('posts/'))
}
