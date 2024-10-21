import React from 'react';
import {default as SubTabs} from './SubTabs';

function MyTabs() {
  return (
    <>
      <SubTabs />
    </>
  );
}

export default function Tabs() {
  return <MyTabs />;
}