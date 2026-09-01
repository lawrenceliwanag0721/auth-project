import { cookies } from 'next/headers'
import PostCard from '@/components/Postcard';
import { redirect } from 'next/dist/server/api-utils';

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
  console.log(data);
  
  return (
    <div className='h-screen flex justify-center w-full p-8'>
      <div className='w-full max-w-2xl'>
        <PostCard post={data}/>
      </div>
    </div>
  )
}
