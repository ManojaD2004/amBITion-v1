import React from "react";
import Header from "../components/header";
import Formcomponents from "./components/formcomponents";
import { auth } from "../../../auth";

export default async function Page() {
  const session = await auth();
  return (
    <div>
      <Header />
      <div className="h-[50rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="">
          <Formcomponents user={session?.user} />
        </div>
      </div>
    </div>
  );
}
