"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import getImageURL from "@/app/actions/getImage";

const InfoBar = () => {
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const path = pathname.split("/").pop();
  let formattedPath = path
    ? path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()
    : "";

  if (pathname.includes("editor")) formattedPath = "Editor";

  useEffect(()=>{
    const getImage = async () => {
      const imageUrl2 = await getImageURL();
      // console.log("imageUrl2" + imageUrl2);
      if(imageUrl2){
        setImageUrl(imageUrl2);
      }
    }
    getImage();
  },[imageUrl,setImageUrl])
  return (
    <TooltipProvider>
      <Tooltip>
        <div className="flex flex-col gap-4 relative">
          <div className="flex justify-between text-3xl sticky top-0 z-[10] py-2 px-8 bg-background/50 backdrop-blur-lg items-center border-b rounded-3xl">
            <h1 onClick={() => router.push("/")} className={`cursor-pointer`}>
              Autominds
            </h1>
            <div className="flex gap-10">
              <div className="flex gap-10 mt-2 text-2xl">
                <h3
                  onClick={() => router.push("/dashboard")}
                  className={`cursor-pointer ${
                    formattedPath.toLowerCase() === "dashboard"
                      ? "text-white"
                      : "text-[#abaaaa]"
                  }`}
                >
                  Dashboard
                </h3>
                <h3
                  onClick={() => router.push("/connections")}
                  className={`cursor-pointer ${
                    formattedPath.toLowerCase() === "connections"
                      ? "text-white"
                      : "text-[#abaaaa]"
                  }`}
                >
                  Connections
                </h3>
                <h3
                  onClick={() => router.push("/workflows")}
                  className={`cursor-pointer ${
                    formattedPath.toLowerCase() === "workflows"
                      ? "text-white"
                      : "text-[#abaaaa]"
                  }`}
                >
                  Worflows
                </h3>
              </div>
              <div
                className="pr-4 cursor-pointer"
                onDoubleClick={() => signOut()}
              >
                <TooltipTrigger>
                  <Image
                    src={
                      status === "authenticated"
                        ? imageUrl || "/deafult-person.png"
                        : "/deafult-person.png"
                    }
                    width={500}
                    height={500}
                    alt="Profile"
                    className="rounded-[40px] h-[40px] w-[40px]"
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-black/10 backdrop-blur-xl text-white text-[14px]">
                  <p>Double click to Logout </p>
                </TooltipContent>
              </div>
            </div>
          </div>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoBar;
