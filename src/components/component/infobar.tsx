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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useIsWorkflowSavedStore } from '@/store/Saving';

const Header = () => {
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const path = pathname.split('/').pop();
  let formattedPath = path
    ? path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()
    : '';
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [exitDestination, setExitDestination] = useState('');
  const { isSaved, setIsSaved } = useIsWorkflowSavedStore();

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

  const confirmExit = () => {
    setIsExitModalOpen(false);
    router.push(exitDestination);
  };

  const handleExit = (destination: string) => {
    if (isSaved) {
      router.push(destination);
    } else {
      setExitDestination(destination);
      setIsExitModalOpen(true);
    }
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-10 w-full bg-background/50 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1
            onClick={() => handleExit('/')}
            className="text-2xl font-bold p-0 cursor-pointer text-primary"
          >
            Autominds
          </h1>
          <div className="bg-muted px-4 py-2 rounded-full">
            <nav className="flex space-x-6">
              {['Dashboard', 'Connections', 'Workflows'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleExit(`/${item.toLowerCase()}`)}
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
      <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExitModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmExit}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default Header;
