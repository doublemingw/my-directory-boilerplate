'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

import { giscusConfigs } from '@/config/comment';
import { usePathname } from 'next/navigation';

interface CommentProps {
    lang: string;
}

export const Comment = ({lang} : CommentProps) => {
    const { theme } = useTheme();
    const pathname = usePathname();
    const term = pathname?.replace('/' + lang, '');

    return (
        <div id="comment" className="mx-auto">
            <Giscus
                repo={giscusConfigs.repo}
                repoId={giscusConfigs.repoId}
                category={giscusConfigs.category}
                categoryId={giscusConfigs.categoryId}
                mapping="specific"
                term={term}
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={theme === 'dark' ? 'transparent_dark' : 'light'}
                lang={lang === 'zh' ? 'zh-CN' : 'en'}
                // loading="lazy"
            />
        </div>
    );
};

export default Comment;