import { ActionBar } from '@onlineclass/containers/action-bar';
import { useStore } from '@onlineclass/utils/hooks';
import React, { useEffect } from 'react';
import { StatusBar } from '../containers/status-bar';

export const Classroom = () => {
  const { join } = useStore();
  useEffect(() => {
    join();
  }, []);
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#000',
      }}>
      <StatusBar></StatusBar>
      <ActionBar></ActionBar>
    </div>
  );
};
