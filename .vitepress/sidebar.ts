import { DefaultTheme } from "vitepress"

export const sidebar: DefaultTheme.Sidebar = {
    '/notes/rust': [
        {
            text: 'Rust 笔记',
            items: [
                {
                    text: '1',
                    link: '/notes/rust/1'
                },
                {
                    text: '2',
                    link: '/notes/rust/2'
                },
                {
                    text: '3',
                    link: '/notes/rust/3'
                }
            ]
        }
    ]
}