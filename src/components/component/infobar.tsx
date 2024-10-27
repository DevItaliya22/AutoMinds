'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import getImageURL from '@/app/actions/getImage';

const Header = () => {
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const path = pathname.split('/').pop();
  let formattedPath = path
    ? path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()
    : '';

  if (pathname.includes('editor')) formattedPath = 'Editor';

  useEffect(() => {
    const getImage = async () => {
      const imageUrl2 = await getImageURL();
      if (imageUrl2) {
        setImageUrl(imageUrl2);
      }
    };
    getImage();
  }, []);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-10 w-full bg-background/50 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1
            onClick={() => router.push('/')}
            className="text-2xl font-bold cursor-pointer text-primary"
          >
            Autominds
          </h1>
          <div className="bg-muted px-4 py-2 rounded-full">
            <nav className="flex space-x-6">
              {['Dashboard', 'Connections', 'Workflows'].map((item) => (
                <button
                  key={item}
                  onClick={() => router.push(`/${item.toLowerCase()}`)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    formattedPath.toLowerCase() === item.toLowerCase()
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer" onDoubleClick={() => signOut()}>
                <Image
                  src={
                    status === 'authenticated'
                      ? imageUrl || '/deafult-person.png'
                      : '/deafult-person.png'
                  }
                  width={40}
                  height={40}
                  alt="Profile"
                  className="rounded-full"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-primary-foreground text-sm">
              <p>Double click to Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;
