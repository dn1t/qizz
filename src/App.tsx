import { observer } from 'mobx-react-lite';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Main from './pages/Main';
import store from './store';

const App = observer(() => {
  const { clientObject } = store;

  return (
    <>
      {!clientObject.logon ? <Login /> : <Main />}
      <Toaster position='bottom-left' reverseOrder={false} />
    </>
  );
});

export default App;
