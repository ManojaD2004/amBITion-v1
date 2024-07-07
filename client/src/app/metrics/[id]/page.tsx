"use client";
import React, { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import ip from "@/app/globalvariables";

const Page = ({ params }: { params: any }) => {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);

  useEffect(() => {
    let timeoutId: any;

    async function getData() {
      // console.log(params.id);
      const response = await fetch(`${ip}/metrics/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
      const perCent = parseFloat(result.logEvents.CPUPerc.replace("%", ""));
      setValue1(perCent);
      // const regexMin = /\s\/\s\d+Gib/ ;
      // const utilMem = parseFloat(result.logEvents.MemUsage.replace(regexMin,""))
      // console.log(utilMem);
      // const regexMax = /\.*\/\s/;
      // const maxMem = parseFloat(result.logEvents.MemUsage.replace(regexMax,"").replace("GiB",""));
      // console.log(maxMem);
      let regex = /(\d+(\.\d+)?)(?=MiB|GiB)/g;
      // Extract the float values
      let matches = result.logEvents.MemUsage.match(regex);
      let value1 = parseFloat(matches[0]);
      let value2 = parseFloat(matches[1]);
      console.log(value1); // 3.121
      console.log(value2); // 2
      setValue2(value1);
      setValue3(value2 * 1024);
    }
    timeoutId = setInterval(() => {
      getData();
    }, 2000);
    getData();

    return () => clearInterval(timeoutId);
  }, []);

  return (
    <div className="text-white pt-[30px]">
      <div className="p-[40px]">
        <p className="text-[160px] font-bold text-purple-500">{value1/2}{'%, '}{value2}MB</p>
        <p className="text-[50px]">CPU utilization</p>
      </div>
      <div className="flex mt-[50px] items-center justify-center gap-[500px]">
        <div className="text-[30px]">
          Ram:
          <ReactSpeedometer
            maxValue={1024}
            value={value2}
            needleColor="red"
            startColor="green"
            segments={10}
            endColor="blue"
          />
        </div>
        <div className="text-[30px]">
          CPU:
          <ReactSpeedometer
            maxValue={100}
            value={value1/2}
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
