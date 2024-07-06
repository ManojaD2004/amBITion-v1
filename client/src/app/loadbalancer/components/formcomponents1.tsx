"use client";
import React, { useState } from "react";
import { cn } from "@/app/utils/cn";
import Link from "next/link";
import { Label } from "../../create-instance/components/label";
import { Input } from "../../create-instance/components/input";
import ip from "@/app/globalvariables";

interface Data {
  link: string;

  projectId: string;
}

const Formcomponents1 = (username: any) => {
  const [link, setLink] = useState("");
  const [projectId, setProjectid] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser: Data = { link, projectId };

    try {
      const response = await fetch(`${ip}/create/${username}/dockerinstance`, {
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
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Create git instance
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        We can create a new instance by filling the below details.Enter the
        required parameters for your use case.
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
          <Label htmlFor="projectId">Github link</Label>
          <Input
            id="projectId"
            placeholder="https://github.com/ManojaD2004/amBITion-v1.git"
            type="text"
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Create Instance &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
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
