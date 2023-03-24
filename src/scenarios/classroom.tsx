import { ActionBar } from '@onlineclass/containers/action-bar';
import React from 'react';
import { StatusBar } from '../containers/status-bar';

export const Classroom = () => {
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
