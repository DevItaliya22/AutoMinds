'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ModeToggle } from '../ui/theme-button';

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-neutral-950 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between ">
      <aside className="flex items-center gap-[2px]">
        <p className="text-3xl pl-[20px] font-bold text-[#fff] ">Autominds</p>
      </aside>
      <aside className="flex items-center gap-4">
        <Link
          href={{
            pathname:
              status === 'authenticated' ? '/workflows' : '/auth/signin',
          }}
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] "
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {status === 'authenticated' ? 'Dashboard' : 'Sign In'}
          </span>
        </Link>
        {/* <ModeToggle></ModeToggle> */}
      </aside>
    </header>
  );
};

export default Navbar;
