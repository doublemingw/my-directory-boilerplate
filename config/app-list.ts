import { AppListConfig } from "@/types";

const enAppListConfig: AppListConfig = {
    title: "Application List",
    subtitle: "List all your indie applications",
    submitAppButton: "Submit Application",
    emptyAppList: "No application submitted yet",
    form: {
        title: "Please enter the name and link of the product.",
        name: "Name",
        namePlaceHolder: "32 characters maximum, example: ChatGPT",
        link: "Link",
        linkPlaceHolder: "product website or github repository, example: https://chatgpt.openai.com or https://github.com/openai/chatgpt",
        desc: "Desc",
        descPlaceHolder: "128 characters maximum, example: ChatGPT is a large language model",
        types: "Type",
        image: "Logo",
        coverImage: "Cover Image",
        update: "Update",
        updating: "Updating...",
        delete: "Delete",
        deleting: "Deleting...",
        imageUploading: "Image Uploading...",
        success: "Your application has been updated.",
        error: "Something went wrong. Please try again.",
        deleteSuccess: "Your application has been deleted.",
        deleteError: "Something went wrong. Please try again.",
    }
}

const zhAppListConfig: AppListConfig = {
    title: "应用列表",
    subtitle: "您的独立应用列表",
    submitAppButton: "提交应用",
    emptyAppList: "暂无应用提交",
    form: {
        title: "请输入产品的名称和链接。",
        name: "名称",
        namePlaceHolder: "最多32个字符, 例如: ChatGPT",
        link: "链接",
        linkPlaceHolder: "产品网站或者Github链接, 例如: https://chatgpt.openai.com or https://github.com/openai/chatgpt",
        desc: "描述",
        descPlaceHolder: "最多128个字符, 例如: ChatGPT是一个大语言模型",
        types: "类型",
        image: "Logo",
        coverImage: "封面图",
        update: "更新",
        updating: "更新中...",
        delete: "删除",
        deleting: "删除中...",
        imageUploading: "图片上传中...",
        success: "您的应用已更新",
        error: "出错了, 请重试",
        deleteSuccess: "您的应用已删除",
        deleteError: "出错了, 请重试",
    }
}

export const AllAppListConfigs: {[key: string]: AppListConfig} = {
    en: enAppListConfig,
    zh: zhAppListConfig,
}