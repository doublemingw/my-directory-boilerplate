import { AuthConfig } from "types";

const enAuthConfig: AuthConfig = {
    signin: 'Sign In',
    signinDesc: 'Sign in to submit your awesome applications',
    signinWithGitub: 'Sign In with Github',
    signinWithGoogle: 'Sign In with Google',
    logout: 'Log Out',
}

const zhAuthConfig: AuthConfig = {
    signin: '登录',
    signinDesc: '登录账号以便提交您的独立应用',
    signinWithGitub: 'Github账号登录',
    signinWithGoogle: 'Google账号登录',
    logout: '退出',
}

export const AllAuthConfigs:{[key: string]: AuthConfig} = {
    en: enAuthConfig,
    zh: zhAuthConfig,
}