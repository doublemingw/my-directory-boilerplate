import { ProductConfig } from "types";

const enConfig: ProductConfig = {
    title: 'Products',
    subtitle: 'Explore the best products to help you ship next application faster and better',
    submitButton: 'Submit Product',
    details: 'Details',
    introduction: 'Introduction',
    github: 'Github',
    source: 'Source',
    price: 'Price',
    website: 'Website',
    submitter: 'Submitter',
    free: 'Free',
    opensource: 'OpenSource',
    date: 'Date',
}

const zhConfig: ProductConfig = {
    title: '工具',
    subtitle: '发掘最优秀的工具，助力你快速发布你的下一个应用',
    submitButton: '推荐工具',
    details: '详情',
    introduction: '简介',
    github: '代码',
    source: '来源',
    price: '价格',
    website: '官网',
    submitter: '推荐者',
    free: '免费',
    opensource: '开源',
    date: '日期',
}

export const AllProductConfigs:{[key: string]: ProductConfig} = {
    en: enConfig,
    zh: zhConfig,
}