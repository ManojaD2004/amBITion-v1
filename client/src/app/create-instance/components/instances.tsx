"use client";
import React, { useState, useEffect } from "react";
import Cards from "./Card";
import { cn } from "@/app/utils/cn";
import Link from "next/link";
import ip from "@/app/globalvariables";

interface event {
  prjId: string;
  avaPorts: string[];
  contId: string;
  defaultCont:boolean;
}

interface Data {
  gotten: boolean;
  resEvents: event[];
  message:string;
}

const Instances = ({ user }: any) => {
  const [data1, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function getData() {
      const response = await fetch(
        `${ip}/getinstances/${user.name}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log(result);
      
      setData(result);
    }
    getData();
  }, []);
  return (
    <div className="text-white">
       
      {data1?.resEvents.length === 0 ? (
        <div className="">
          <Cards username={user.name}/>
        </div>
      ) : (
        data1?.resEvents.map((ele) => (
          <div className="text-white">
            no
            <Card className="flex gap-[50px] mb-[100px]">
              <div>
                <CardTitle>Projectid</CardTitle>
                <CardDescription>{ele.prjId}</CardDescription>
              </div>
              <div>
                <CardTitle>Ports available</CardTitle>
                <CardDescription>{ele.avaPorts}</CardDescription>
              </div>
              <div>
                <CardTitle>Status</CardTitle>
                <CardDescription>
                  <span className="text-[10px]">&#128994;</span> Ready
                </CardDescription>
              </div>
              <div className="flex items-center justify-center">
                <Link
                  href={`/terminal/${user.name}/${ele.prjId}`}
                  className="bg-[#ededed] rounded-md text-black px-[15px] py-[10px] text-sm"
                >
                  connect
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <button onClick={() => {
                    async function deleteCont() {
                        const response = await fetch(
                            `${ip}/delete/${user.name}/${ele.contId}`,
                            {
                                method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ projectId: ele.prjId, })
                            }
                          );
                    }
                    deleteCont();
                }} className="bg-[#e12129] rounded-md text-white px-[20px] py-[10px] text-sm">
                  delete
                </button>
              </div>
            </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default Instances;

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "max-w-[1200px] w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-sm  text-neutral-600 dark:text-neutral-400 py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-gray-800 dark:text-white max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
