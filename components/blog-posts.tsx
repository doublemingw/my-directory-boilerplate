import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FeaturePageHeader } from './feature-page-header';

export function BlogPosts({ posts }) {
  return (
    <div className="pt-4 pb-16">
      {/* Page Header */}
      <div className="bg-linear py-10">
        <FeaturePageHeader className="container"
          heading="Blog Posts"
          text="This section includes blog posts to make announcements or change logs about this site." />
      </div>
      {/* </div> */}

      <section className="container">
        {/* <h2 className="mb-4 font-heading text-3xl">Blog Posts</h2> */}
        {/* className="group relative cursor-pointer overflow-hidden 
          rounded-xl border p-5 md:py-5 transition-all 
          hover:bg-accent md:scale-100 md:hover:scale-105" */}
        {/* group relative flex flex-col space-y-2 */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0).map((post) => (
            <article key={post._id} className="group relative cursor-pointer overflow-hidden 
            rounded-xl border p-5 md:py-5 space-y-2 transition-all 
            hover:bg-accent md:scale-100 md:hover:scale-105">
              {/* border  */}
              {post.image && (
                <Image
                  alt={post.title}
                  src={post.image}
                  width={804}
                  height={452}
                  className="rounded-md bg-muted transition-colors"
                />
              )}
              <h2 className="line-clamp-1 font-heading text-2xl">{post.title}</h2>
              {post.description && (
                <p className="line-clamp-2 text-muted-foreground">{post.description}</p>
              )}
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              )}
              <Link href={post.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

