"use client";
import React, { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";

const Page = () => {
  const [value, setValue] = useState();

  useEffect(() => {
    async function getData() {
      const response = await fetch(`${ip}/getinstances/${user.name}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);

      setValue(result);
    }
    getData();
  }, []);


  return (
    <div className="text-white pt-[30px] ">
      
      <div className="p-[40px]">
        <p className="text-[160px] font-bold text-purple-500">905 MB</p>
        <p className="text-[50px] ">CPU utilization</p>
      
      </div>
      <div className="flex mt-[50px] items-center justify-center gap-[500px]">
        
          <div className="text-[30px]">Ram:
            <ReactSpeedometer
              maxValue={500}
              value={value}
              needleColor="red"
              startColor="green"
              segments={10}
              endColor="blue"
            />
            
          </div>
            <div className="text-[30px]">
            Storage:
          <ReactSpeedometer
            maxValue={500}
            value={value}
            needleColor="red"
            startColor="green"
            segments={10}
            endColor="blue"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
