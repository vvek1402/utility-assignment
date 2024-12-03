import { Outlet } from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

const App = () => {


  return (
    <MantineProvider>
      <Outlet />
    </MantineProvider>
  );
};

export default App;