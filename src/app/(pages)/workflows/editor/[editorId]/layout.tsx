'use client';
import React from 'react';
import { ReactFlowProvider } from 'reactflow';

type Props = { children: React.ReactNode };
const Layout = (props: Props) => {
  return (
    <>
      <ReactFlowProvider>{props.children}</ReactFlowProvider>
    </>
  );
};

export default Layout;
