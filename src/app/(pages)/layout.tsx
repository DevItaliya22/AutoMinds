import InfoBar from '@/components/component/infobar';
import React from 'react';

type Props = { children: React.ReactNode };
const Layout = (props: Props) => {
  return (
    <div className="flex overflow-x-hidden h-screen">
      <div className="w-full">
        <InfoBar />
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
