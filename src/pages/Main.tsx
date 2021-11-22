import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { OAuthCredential } from 'node-kakao';
import { FriendListStruct } from 'node-kakao/src/api/struct';
import store from '../store';
import qs from 'querystring';
import axios from 'axios';
import ChatList from '../components/ChatList';
import TitleBar from '../components/TitleBar';
import Sidebar from '../components/Sidebar';

const requestFriendList = async (credential: OAuthCredential): Promise<FriendListStruct> =>
  (
    await axios.post(
      'https://katalk.kakao.com/win32/friends/update.json',
      qs.stringify({
        contacts: [],
        removed_contacts: [],
        phone_number_type: '7',
        token: '0',
        type: 'a',
        manual: 'true',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          A: 'win32/3.2.3/ko',
          Authorization: `${credential.accessToken}-${credential.deviceUUID}`,
          'User-Agent': 'KT/3.2.3 Wd/10.0 ko',
          Accept: '*/*',
          'Accept-Language': 'ko',
        },
        adapter: window.require('axios/lib/adapters/http'),
      }
    )
  ).data;

const Main = observer(() => {
  reaction(
    () => store.serviceApi,
    async (serviceApi) => {
      const requestMoreSettingsRes = await serviceApi!.requestMoreSettings();
      if (requestMoreSettingsRes.success) store.moreSettings = requestMoreSettingsRes.result;

      const requestFriendListRes = await requestFriendList(store.credential!);
      store.friendList = requestFriendListRes.friends;
    }
  );

  return (
    <div className='flex gap-2 h-screen'>
      <Sidebar />
      <div className='flex flex-col w-full h-full pb-4 pr-4'>
        <TitleBar />
        <div className='rounded-xl bg-indigo-200 h-full w-full relative mt-2'>
          <div className='absolute h-full w-full flex items-center justify-center select-none z-10'>
            <span className='text-indigo-300 text-lg font-bold tracking-evenwider'>QIZZ</span>
          </div>
          {store.selected.category === 'friend' ? <></> : store.selected.category === 'chat' ? <ChatList /> : store.selected.category === 'setting' ? <></> : <></>}
        </div>
      </div>
    </div>
  );
});

export default Main;
