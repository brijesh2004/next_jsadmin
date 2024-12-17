"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Home() {
  const router = useRouter();

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
      router.replace("/login");
    }
  })
  return (
    <div> 
      <div className=" text-center flex-1 justify-center mt-[100px] h-[40px] align-middle">
      <Link href="/actdev" className="border-2 p-[20px] bg-orange-500">Activate and Deactivate Account</Link>
      </div>
    </div>
  );
}
