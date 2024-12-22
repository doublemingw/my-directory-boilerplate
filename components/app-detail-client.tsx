'use client';

import { AllApplicationConfigs } from '@/config/application';
import { AppQueryResult } from '@/sanity.types';
import { CircleUserRoundIcon, Clock3Icon, GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDate } from '@/lib/utils';

export default function AppDetailClient({ lang, app }: { lang: string; app: AppQueryResult }) {
  console.log('AppDetailClient, app:', app);
  if (!app) {
    console.error('AppDetailClient, app not found');
    return notFound();
  }
  // console.log('AppDetailClient, content:', product.content);
  const appConfig = AllApplicationConfigs[lang];

  return (
    <>
      {/* Product Details */}
      <div className='order-1 md:order-2 md:col-span-5 lg:col-span-4'>
        <h2 className="text-xl font-semibold mb-4">
          {appConfig.details}
        </h2>

        {/* Website */}
        {
          app.link &&
          <>
            <div className="flex items-center justify-between py-4 border-b space-x-6">
              <div className='flex items-center space-x-2'>
                <GlobeIcon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {appConfig.website}
                </h3>
              </div>
              <Link
                href={`${app.link}`}
                target="_blank"
                className="line-clamp-1 underline underline-offset-4 
                        hover:text-primary dark:hover:text-primary-400"
              >
                {/* {app.link} */}
                {/* if no http or https, new URL will return invalid URL */}
                {/* {new URL(`${app.link}`).hostname} */}
                {app.link.includes('http') ? new URL(app.link).hostname
                  : new URL(`https://${app.link}`).hostname}
              </Link>
            </div>
          </>
        }

        {/* Submitter */}
        {
          app.user &&
          <>
            <div className="flex items-center justify-between py-4 border-b">
              <div className='flex items-center space-x-2'>
                <CircleUserRoundIcon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {appConfig.submitter}
                </h3>
              </div>

              <div className='flex items-center space-x-2'>
                {
                  app.user?.avatar && (
                    <Avatar className="size-6 border flex item-center justify-center">
                      <AvatarImage className='rounded-full' src={app.user.avatar} alt={app.user.name ?? ""} />
                      <AvatarFallback className='item-center justify-center'>
                        {/* {app.user.name} */}
                      </AvatarFallback>
                    </Avatar>
                  )
                }
                {
                  app.user?.name && (
                    <>
                      {
                        app.user.link && (
                          <Link href={app.user.link} target='_blank'
                            className='text-sm text-muted-foreground line-clamp-1 
                            hover:underline hover:underline-offset-4 hover:text-primary' >
                            {app.user?.name || 'unknown'}
                          </Link>
                        )
                      }
                      {
                        !app.user?.link && (
                          <span className='text-sm text-muted-foreground line-clamp-1'>
                            {app.user?.name || 'unknown'}
                          </span>
                        )
                      }
                    </>
                  )
                }
              </div>
            </div>
          </>
        }

        {/* Date */}
        {
          app.date &&
          <>
            <div className="flex items-center justify-between py-4 border-b space-x-6">
              <div className='flex items-center space-x-2'>
                <Clock3Icon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  {appConfig.date}
                </h3>
              </div>
              <span className="line-clamp-1 text-muted-foreground">
                {formatDate(app.date)}
              </span>
            </div>
          </>
        }
      </div>
    </>
  )
}
