import { LampComponent } from '@/components/landing/lamp';
import Navbar from '@/components/landing/navbar';

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col w-[100vw]">
      <Navbar />
      <section className="">
        <LampComponent />
      </section>
    </main>
  );
}
