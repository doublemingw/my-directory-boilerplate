'use client';

import { ProductQueryResult } from '@/sanity.types';
import { PortableTextBlock } from 'next-sanity';
import { notFound } from 'next/navigation';
import { Comment } from './comment';
import PortableText from './portable-text';
import ProductDetailClient from './product-detail-client';
import ProductHeaderClient from './product-header-client';
import { AllProductConfigs } from '@/config/product';

export default function ProductSingleClient({ lang, product }: { lang: string; product: ProductQueryResult }) {
  // console.log('ProductSingleClient, product:', product);
  if (!product) {
    console.error('ProductSingleClient, product not found');
    return notFound();
  }
  // console.log('ProductSingleClient, content:', product.content);
  const productConfig = AllProductConfigs[lang];

  // if lang is zh, and product.content_zh is not null, then content is product.content_zh
  // otherwise, content is product.content
  // const content = (lang === 'zh' && product.content_zh) || product.content;

  return (
    <>
      {/* removed container here, and add it to children components */}
      <div className="min-h-screen pb-16">
        <div className="mx-auto space-y-8">
          {/* Product */}
          <ProductHeaderClient lang={lang} product={product} />

          {/* Overview & Content & Details */}
          <div className="container grid gap-8 md:grid-cols-12">
            <div className="order-2 md:order-1 md:col-span-6 lg:col-span-7 flex flex-col gap-4">
              {/* introduction */}
              <h2 className="text-xl font-semibold mb-4">
                {productConfig.introduction}
              </h2>

              {/* Content */}
              {
                product.content?.length && (
                  <>
                    <PortableText
                      className="text-muted-foreground leading-loose tracking-wide"
                      value={product.content as PortableTextBlock[]}
                    />

                    {/* https://github.com/sanity-io/block-content-to-markdown */}
                    {/* TypeError: (0 , _sanity_block_content_to_markdown__WEBPACK_IMPORTED_MODULE_1__.toMarkdown) is not a function */}
                    {/* <Mdx code={toMarkdown(product.content)} /> */}
                  </>
                )
              }
            </div>

            <div className='order-3 md:order-2'></div>

            {/* Details */}
            <div className='order-1 md:order-3 md:col-span-5 lg:col-span-4'>
              <ProductDetailClient lang={lang} product={product} />
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="container mt-16 pt-8 border-t">
          <div className='mx-auto max-w-5xl'>
            <Comment lang={lang} />
          </div>
        </div>
      </div>
    </>
  )
}
