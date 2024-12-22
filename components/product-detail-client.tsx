'use client';

import { AllProductConfigs } from '@/config/product';
import { Guide, ProductQueryResult } from '@/sanity.types';
import { CircleDollarSignIcon, CircleUserRoundIcon, Clock3Icon, CrosshairIcon, GithubIcon, GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGuideCard from './product-guide-card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDate } from '@/lib/utils';

export default function ProductDetailClient({ lang, product }: { lang: string; product: ProductQueryResult }) {
  console.log('ProductDetailClient, product:', product);
  if (!product) {
    console.error('ProductDetailClient, product not found');
    return notFound();
  }
  // console.log('ProductDetailClient, content:', product.content);
  const productConfig = AllProductConfigs[lang];

  let website = product.website;
  if (website && website.indexOf('utm_source') === -1) {
    website = `${website}?utm_source=indiehackers.site&utm_medium=referral`;
  }

  return (
    <>
      {/* Product Details */}
      <div className='order-1 md:order-2 md:col-span-5 lg:col-span-4'>
        <h2 className="text-xl font-semibold mb-4">
          {productConfig.details}
        </h2>

        {/* Website */}
        {
          product.website &&
          <>
            <div className="flex items-center justify-between py-4 border-b">
              <div className='flex items-center space-x-2'>
                <GlobeIcon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {productConfig.website}
                </h3>
              </div>
              <Link
                href={`${website}`}
                target="_blank"
                className="line-clamp-1 underline underline-offset-4 
                hover:text-primary dark:hover:text-primary-400"
              >
                {/* {product.website} */}
                {/* if no http or https, new URL will return invalid URL */}
                {/* {new URL(`${product.website}`).hostname} */}
                {product.website.includes('http') ? new URL(product.website).hostname
                  : new URL(`https://${product.website}`).hostname}
              </Link>
            </div>
          </>
        }

        {/* Price */}
        {
          product.price &&
          <>
            <div className="flex items-center justify-between py-4 border-b">
              <div className='flex items-center space-x-2'>
                <CircleDollarSignIcon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {productConfig.price}
                </h3>
              </div>
              {
                product.priceLink &&
                <Link
                  href={`${product.priceLink}`}
                  target="_blank"
                  className="line-clamp-1 underline underline-offset-4 
                          hover:text-primary dark:hover:text-primary-400"
                >
                  {product.price}
                </Link>
              }
              {
                !product.priceLink &&
                <span>{product.price}</span>
              }
            </div>
          </>
        }

        {/* Github */}
        {
          product.github &&
          <>
            <div className="flex items-center justify-between py-4 border-b">
              <div className='flex items-center space-x-2'>
                <GithubIcon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {productConfig.github}
                </h3>
              </div>
              <Link
                href={`${product.github}`}
                target="_blank"
                className="line-clamp-1 underline underline-offset-4 
                        hover:text-primary dark:hover:text-primary-400"
              >
                {/* https://github.com/vercel/next.js -> next.js */}
                {product.github.split('/').pop()}
              </Link>
            </div>
          </>
        }

        {/* Source */}
        {
          product.source &&
          <>
            <div className="flex items-center justify-between py-4 border-b">
              <div className='flex items-center space-x-2'>
                <CrosshairIcon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {productConfig.source}
                </h3>
              </div>
              <Link
                href={`${product.source}`}
                target="_blank"
                className="line-clamp-1 underline underline-offset-4 
                        hover:text-primary dark:hover:text-primary-400"
              >
                {/* {product.source} */}
                {product.source.includes('http') ? new URL(product.source).hostname
                  : new URL(`https://${product.source}`).hostname}
              </Link>
            </div>
          </>
        }

        {/* Submitter */}
        {
          product.submitter &&
          <>
            <div className="flex items-center justify-between py-4 border-b">
              <div className='flex items-center space-x-2'>
                <CircleUserRoundIcon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {productConfig.submitter}
                </h3>
              </div>

              <div className='flex items-center space-x-2'>
                {
                  product.submitter?.avatar && (
                    <Avatar className="size-6 border flex item-center justify-center">
                      <AvatarImage className='rounded-full' src={product.submitter.avatar}
                        alt={product.submitter.name ?? ""} />
                      <AvatarFallback className='item-center justify-center'>
                        {/* {product.submitter.name} */}
                      </AvatarFallback>
                    </Avatar>
                  )
                }
                <>
                  {
                    product.submitter?.link && (
                      <Link href={product.submitter?.link} target='_blank'
                        className='text-sm text-muted-foreground line-clamp-1 
                            hover:underline hover:underline-offset-4 hover:text-primary' >
                        {product.submitter?.name || 'unknown'}
                      </Link>
                    )
                  }
                  {
                    !product.submitter?.link && (
                      <span className='text-sm text-muted-foreground line-clamp-1'>
                        {product.submitter?.name || 'unknown'}
                      </span>
                    )
                  }
                </>
              </div>
            </div>
          </>
        }

        {/* Date */}
        {
          product.date &&
          <>
            <div className="flex items-center justify-between py-4 border-b space-x-6">
              <div className='flex items-center space-x-2'>
                <Clock3Icon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {productConfig.date}
                </h3>
              </div>
              <span className="line-clamp-1 text-muted-foreground">
                {formatDate(product.date)}
              </span>
            </div>
          </>
        }

        {/* Guide */}
        {
          product.guides &&
          <div className='mt-8 flex flex-col items-center gap-4'>
            {
              product.guides.map((item) => (
                <ProductGuideCard lang={lang} key={item._id} guide={item} />
              ))
            }
          </div>
        }
      </div>
    </>
  )
}
