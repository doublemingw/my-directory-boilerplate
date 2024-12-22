import { ApplicationConfig } from "types";

const enConfig: ApplicationConfig = {
    title: 'Apps',
    subtitle: 'Explore the best indie hackers with their apps to help you get inspired',
    submitButton: 'Submit Application',
    gotoApp: 'Go to app',
    website: 'Website',
    date: 'Date',
    details: 'Details',
    introduction: 'Introduction',
    submitter: 'Developer',
}

const zhConfig: ApplicationConfig = {
    title: '应用',
    subtitle: '发掘最优秀的独立开发者和ta们的应用，助你从中获取灵感',
    submitButton: '提交应用',
    gotoApp: '前往应用',
    website: '网址',
    date: '日期',
    details: '详情',
    introduction: '简介',
    submitter: '开发者',
}

export const AllApplicationConfigs:{[key: string]: ApplicationConfig} = {
    en: enConfig,
    zh: zhConfig,
}