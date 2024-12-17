"use client";
import React, { useState } from 'react';

interface User {
    isActive: string | null;
    userid: string | null;
}
interface Wallet {
    isFreeze: string | null;
    walletid: string | null;
}

function ActDev() {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    console.log(user);
    console.log(wallet);
    const handleCheckStatus = async () => {
        console.log("Checking status for:", email);

        const res = await fetch(`http://localhost:7000/admin/access?email=${email}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (res.status === 200) {
            const data = await res.json();
            setUser(data.user);
            setWallet(data.wallet);
        }
        else {
            alert("Error");
        }

    };

    const handleAccount = async(id:string|null , isuser:boolean)=>{
        try{
          const res = await fetch(`http://localhost:7000/admin/accountstatus?id=${id}&isuser=${isuser}` , {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
          })

          if(res.status===200){
            const data= await res.json();
            console.log("Data",data);
            handleCheckStatus();
          }
          else{
            alert("error while changing the status");
          }
        }
        catch(error){
            alert("error");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center ">
            <div className=" p-6 rounded-md shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-center mb-4 text-gray-800">Check Status</h1>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />

                <button
                    onClick={handleCheckStatus}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
                >
                    Check Status
                </button>
            </div>

            <h2>Status</h2>

            <div>
                {user && user.isActive !== null ? (
                    <div className='mt-14'>
                        Current Account Staus  {user.isActive === "Active" ?
                            <div className='bg-green-500 p-5 inline rounded-lg'>Active</div> :
                            <div className='bg-red-500 p-5 inline rounded-lg'>InActive</div>}

                        <div className='inline-block bg-blue-500 p-4 rounded-lg ml-6 cursor-pointer' onClick={()=>handleAccount(user.userid , true)}>Change Account Status</div>
                    </div>


                ) : null}

                {wallet && wallet.isFreeze !== null ? (
                    <div className='mt-14'>
                        Current Wallet Staus  {wallet.isFreeze === "No" ?
                            <div className='bg-green-500 p-5 inline rounded-lg'>Active</div> :
                            <div className='bg-red-500 p-5 inline rounded-lg'>Freezed</div>}
                            <div  className='inline-block bg-blue-500 p-4 rounded-lg ml-6 cursor-pointer' onClick={()=>handleAccount(wallet.walletid , false)}>Change Wallet Status</div>
                    </div>
                ) : null}

            </div>
        </div>
    );
}

export default ActDev;
