"use client"
import React, { useState, useEffect } from 'react';
import Cards from './Card';

interface event{
    prjId:string;
    avaPorts:string[];
}

interface Data {
    gotten: boolean;
    resevents:event[];
  }

const Instances = ({user}:any) => {
    const [data1, setData] = useState<Data[]>([]);

    useEffect(() => {
        async function getData() {
          const response = await fetch(`https://reqres.in/api/users/${user?.name}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          console.log(result.data);
          const res: Data[] = await result.data; 
          setData(res);
        }
        getData();
      }, []);
  return (
    <div className='text-white'>instances{user?.name}
    {data1?.length === 0 ? (<div className='text-white
    '> 
        hello
    </div>): (<div className='text-white'>
        no hello
        <Cards/>
    </div>)}
    </div>
  )
}

export default Instances