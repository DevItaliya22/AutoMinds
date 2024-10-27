'use client';
import { ConnectionTypes } from '@/lib/types';
import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { signIn, signOut } from 'next-auth/react';
import removeAccessToken from '@/app/actions/removeAccessToken';

type Props = {
  type: ConnectionTypes;
  icon: string;
  title: ConnectionTypes;
  description: string;
  callback: () => void;
  connected: string[];
  isFetching: boolean;
};

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
  callback,
  isFetching,
}: Props) => {
  const handleClick = (type: ConnectionTypes) => {
    if (type === 'Google') {
      signIn('google');
    } else if (type === 'Github') {
      window.location.href = process.env.NEXT_PUBLIC_GITHUB_URL!;
    }
  };

  const handleDisconnect = async (type: ConnectionTypes) => {
    if (type === 'Google') {
      signOut();
    }
    const res = await removeAccessToken(type);
    if (res === 'Aceess Token Removed') {
      callback();
    }
  };

  return (
    <Card className="flex w-[45vw] items-center justify-between ">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <Image
            src={icon}
            alt={title}
            height={30}
            width={30}
            className="object-contain"
          />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        {connected.includes(type) ? (
          <div
            className="border-bg-primary rounded-lg border-2 px-3 py-2 font-bold text-white bg-red-700 cursor-pointer"
            onClick={() => handleDisconnect(type)}
          >
            Disconnect
          </div>
        ) : (
          <div
            onClick={() => {
              handleClick(type);
            }}
            className={`rounded-lg bg-primary p-2 font-bold text-primary-foreground cursor-pointer ${isFetching ? 'opacity-50' : ''}`}
          >
            {isFetching ? 'Loading...' : 'Connect'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;
