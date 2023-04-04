import { ActionBar } from '@onlineclass/containers/action-bar';
import { StatusBar } from '@onlineclass/containers/status-bar';

export const CoverView = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 20,
        pointerEvents: 'none',
      }}>
      <StatusBar></StatusBar>

      <ActionBar></ActionBar>
    </div>
  );
};
