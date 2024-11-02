'use client';

import { Button } from '@/components/ui/button';
import { ChromeIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Signin() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') {
    router.push('/dashboard');
  }

  return (
    <div className="flex min-h-[100dvh] bg-gradient-to-b from-black from-12% via-purple-950 via-70% to-purple-800 to-90%">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sign Up or Sign In
            </h1>
            <p className="mt-2 text-purple-300">
              Create an account or Login to get started with AutoMinds
            </p>
          </div>
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 bg-purple-900 text-white border-purple-700 hover:bg-purple-800 hover:text-purple-100"
              onClick={() => signIn('google')}
            >
              <ChromeIcon className="h-5 w-5" />
              Sign up with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-transparent">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="aurora-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#4B0082" />
              <stop offset="50%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#9400D3" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M50 0 Q50 50 50 100"
            stroke="url(#aurora-gradient)"
            strokeWidth="2"
            fill="none"
            style={{
              animation: 'aurora-wave 10s ease-in-out infinite',
            }}
          />
          {[...Array(20)].map((_, i) => (
            <path
              key={i}
              d={`M50 0 Q${50 + (i - 10) * 3} 50 50 100`}
              stroke="url(#aurora-gradient)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
              filter="url(#glow)"
              style={{
                animation: 'aurora-wave 8s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </svg>
      </div>
      <style jsx>{`
        @keyframes aurora-wave {
          0%,
          100% {
            transform: scaleX(1) translateX(0);
          }
          50% {
            transform: scaleX(1.5) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
