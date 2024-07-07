"use client";
import React, { useState,useEffect } from "react";
import { cn } from "@/app/utils/cn";
import Link from "next/link";
import { Label } from "../../create-instance/components/label";
import { Input } from "../../create-instance/components/input";
import ip from "@/app/globalvariables";
import toast from "react-hot-toast";

interface Data {
  githubLink1: string;
  githubLink2:string;
  projectId: string;
}

interface Data1{
  prjId:string;
  avaPorts:string;
  contId:string[];
  defaultCont:boolean;
}

const Formcomponents1 = ({user}: any) => {
  const [link1, setLink1] = useState("");
  const [projectId, setProjectid] = useState("");
  const [link2, setLink2] = useState("");
  const [data1,setData]=useState<Data1[]|null>(null);

  useEffect(() => {
    async function getData() {
      const response = await fetch(
       `${ip}/getloadbalancers/${user.name}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log(result);
      
      setData(result.resEvents);
    }
    getData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser: Data = { githubLink1:link1, githubLink2:link2, projectId };

    try {
      const response = await fetch(`${ip}/create/${user.name}/loadbalancer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Posted data:", result);
      if (result.created == true) {
        toast.success("Load balancer created")
      }

    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div>
    
   {data1?.length === 0 ? (
       <div className="max-w-[1000px] w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
       <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
         Create load balancer
       </h2>
       <p className="text-neutral-600 text-sm max-w-[1200px] mt-2 dark:text-neutral-300">
         You can create a load balancer for your website to manage the load on the website
       </p>
       <form className="my-8" onSubmit={handleSubmit}>
         <LabelInputContainer className="mb-4">
           <Label htmlFor="projectId">Project id</Label>
           <Input
             id="projectId"
             placeholder="projcetv1"
             type="text"
             onChange={(e) => setProjectid(e.target.value)}
             required
           />
         </LabelInputContainer>
 
         <LabelInputContainer className="mb-4">
           <Label htmlFor="link1">Github link 1</Label>
           <Input
             id="link1"
             placeholder="https://github.com/ManojaD2004/amBITion-v1.git"
             type="text"
             onChange={(e) => setLink1(e.target.value)}
             required
           />
         </LabelInputContainer>
         <LabelInputContainer className="mb-4">
           <Label htmlFor="link2">Github link 2</Label>
           <Input
             id="link2"
             placeholder="https://github.com/ManojaD2004/amBITion-v1.git"
             type="text"
             onChange={(e) => setLink2(e.target.value)}
             required
           />
         </LabelInputContainer>
 
         <button
           className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
           type="submit"
         >
           Create LoadBalancer &rarr;
           <BottomGradient />
         </button>
       </form>
     </div>
      ) :(
   
        (
          data1?.map((ele:any) => (
            <div className="text-white" >
              
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
                  <a
                    href={`${ip.replace(":5000","")}:${ele.avaPorts}`}
                    target="_blank"
                    className="bg-[#ededed] rounded-md text-black px-[15px] py-[10px] text-sm"
                  >
                    visit site
                  </a>
                </div>
                <div className="flex items-center justify-center">
                  <button onClick={() => {
                      async function deleteCont() {
                          const response = await fetch(
                              `${ip}/delete/lb/${user.name}`,
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
        )
     )} </div>
  );
};

export default Formcomponents1;

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

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
