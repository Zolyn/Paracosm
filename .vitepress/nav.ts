import { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.NavItem[] = [
    { text: 'Home', link: '/' },
    { text: 'Archives', link: '/archives/' },
    { text: 'Tags', link: '/tags/' },
    { text: 'About', link: '/about/' },
    {
        text: 'Notes',
        items: [
            {
                text: 'Rust',
                link: '/notes/rust/1'
            }
        ]
    }
];
