import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import PostDetail from '@/components/PostDetail';

export default async function page({params}) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('AuthToken')?.value;
  const {postId} = await params;

  if(!authToken){
    redirect('/');
  }

  const response = await
    fetch(`http://localhost:5000/api/post/${postId}`,{
      method: "GET",
      headers: {
        Cookie: `AuthToken=${authToken}`
      },
      cache: 'no-store',
    });

  const data = await response.json();
  
  return (
    <div className="h-full flex flex-col items-center w-full px-8 pb-48">
      <PostDetail post={data} postId={postId}/>
    </div>
  );
}
