import { GuideConfig } from "types";

const enConfig: GuideConfig = {
    title: 'Guides',
    subtitle: 'Explore the best guides to help you quick start your indie applications',
    seeAllGuides: 'See All Guides',
}

const zhConfig: GuideConfig = {
    title: '指南教程',
    subtitle: '阅读最实用的教程，助你快速上手常用工具，早日发布独立产品',
    seeAllGuides: '返回所有教程',
}

export const AllGuideConfigs:{[key: string]: GuideConfig} = {
    en: enConfig,
    zh: zhConfig,
}