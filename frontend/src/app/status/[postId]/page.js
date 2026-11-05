import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import PostDetail from '@/features/posts/components/PostDetail';
import { ApiRequestError, getPostById, getPostReplies } from '@/lib/server/posts'

export default async function page({params}) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('AuthToken')?.value;
  const {postId} = await params;

  if(!authToken){
    redirect('/');
  }

  let post
  let replies
  try {
    post = await getPostById(authToken, postId)
    replies = await getPostReplies(authToken, postId)
  } catch (error) {
    if (error instanceof ApiRequestError) redirect('/')
    throw error
  }
  
  return (
    <div className="h-full flex flex-col items-center w-full px-8 pb-48">
      <PostDetail post={post} postId={postId} replies={replies}/>
    </div>
  );
}
