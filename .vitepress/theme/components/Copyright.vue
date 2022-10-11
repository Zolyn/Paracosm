<template>
    <div class="site-footer">
        MIT and CC-BY-NC 4.0 Licensed | Copyright © 2020-2022 <a class="vitepress" :href="website">{{ webTitle }}</a
        ><br />
        Powered by
        <a class="vitepress" target="_blank" href="//vitepress.vuejs.org/">VitePress - {{ vitePressVersion }}</a>
    </div>
</template>
<script lang="ts" setup>
import { devDependencies } from '../../../package.json'
import { useData } from 'vitepress'

const { site, theme } = useData()
const website = theme.value.website
const webTitle = site.value.title

const vitePressVersion = devDependencies.vitepress;
</script>

<style>
.site-footer {
    color: var(--vp-c-text-2);
    text-align: center;
    font-size: 0.75rem;
    width: 100%;
    padding: 15px 0;
    overflow: auto;
}
.vitepress {
    color: var(--vp-c-text-1);
    font-weight: 700;
}
</style>
