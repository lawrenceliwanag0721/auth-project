import Link from 'next/link'
import PostCard from './Postcard'
import ReplyComposer from './ReplyComposer'
import ReplySection from './ReplySection';
import { getReplies } from '@/app/actions/getReplies';

export default async function PostDetail({ post, postId }) {
  const replies = await getReplies(postId)
  return (
    <main className="w-full max-w-2xl flex flex-col gap-8">
      <nav className="sticky top-0 z-10">
        <Link
          href="/"
          className="block bg-white/70 backdrop-blur-md text-black/60 hover:text-black transition-colors p-4 hover:bg-zinc-100"
        >
          ← Post
        </Link>
      </nav>

      <article>
        <PostCard post={post} />
        <section aria-label="Replies">
          <ReplySection postId={postId} replies={replies} />
        </section>
      </article>
    </main>
  )
}