import all from 'it-all';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Main from './pages/Main';
import store from './store';

const App = observer(() => {
  const { client } = store;

  reaction(
    () => store.logon,
    async () => {
      store.channelList = Array.from(client.channelList.all());

      console.log(store.channelList);

      for (const channel of store.channelList) {
        const syncChatListRes = await all(channel.syncChatList(channel.info.lastChatLogId));

        store.chatList[channel.channelId.toString()] = syncChatListRes.flatMap((res) => (res.success ? res.result : []));

        console.log(channel.getDisplayName(), Array.from(channel.getAllUserInfo()).length);
      }
    }
  );

  return (
    <>
      {!store.logon ? <Login /> : <Main />}
      <Toaster position='bottom-left' reverseOrder={false} />
    </>
  );
});

export default App;
