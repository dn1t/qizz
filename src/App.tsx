import { observer } from 'mobx-react-lite';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import store from './store';

const App = observer(() => {
  const { clientObject } = store;

  return (
    <>
      {!clientObject.logon ? <Login /> : <div></div>}
      <Toaster position='bottom-left' reverseOrder={false} />
    </>
  );
});

export default App;
