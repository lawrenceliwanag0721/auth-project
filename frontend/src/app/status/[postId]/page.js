'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function page() {
  const { postId } = useParams();
  const [post, setPost] = useState([]);
  useEffect(() => {
    const getPost = async () => {
      try{
        const response = await
          fetch(`http://localhost:5000/api/post/${postId}`,{
            method: "GET",
            credentials: "include",
          })
        
        if (response.ok){
          const data = await response.json();
          setPost(data);
        }
      }catch(error){
        console.log(error)
      }
    }
    getPost();
  },[]);
  
  return (
    <div className='h-screen flex items-center justify-center'>
      {post.content}
    </div>
  )
}
