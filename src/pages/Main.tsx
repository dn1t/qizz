import React, { useState } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { KnownChatType, OAuthCredential, TalkChatData } from 'node-kakao';
import { FriendListStruct } from 'node-kakao/src/api/struct';
import qs from 'querystring';
import axios from 'axios';
import ChatList from '../components/ChatList';
import TitleBar from '../components/TitleBar';
import Sidebar from '../components/Sidebar';
import store from '../store';

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
  const [msgType, setMsgType] = useState<KnownChatType>(KnownChatType.TEXT);
  const [msgInput, setMsgInput] = useState('');

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
        <div className='bg-indigo-50 rounded-xl flex flex-col w-full h-full mt-2'>
          <div className='bg-indigo-200 rounded-xl h-full w-full relative'>
            <div className='absolute h-full w-full flex items-center justify-center select-none z-10'>
              <span className='text-indigo-300 text-lg font-bold tracking-evenwider'>QIZZ</span>
            </div>
            {store.selected.category === 'friend' ? <></> : store.selected.category === 'chat' ? <ChatList /> : store.selected.category === 'setting' ? <></> : <></>}
          </div>
          {store.selected.category === 'chat' && (
            <form
              className='bg-indigo-50 rounded-b-xl flex items-center'
              onSubmit={async (e) => {
                e.preventDefault();
                if (store.selected.id === undefined) return;

                const channel = store.channelList.find((c) => c.channelId.toString() === store.selected.id?.toString());
                if (channel === undefined) return;

                if (msgType === KnownChatType.TEXT) {
                  const sendMsgRes = await channel.sendChat(msgInput);
                  if (!sendMsgRes.success) return;
                  store.client.emit('chat', new TalkChatData(sendMsgRes.result), channel);
                }

                setMsgInput('');
              }}
            >
              <input className='px-4 py-3 bg-transparent w-full rounded-b-xl focus:outline-none' type='text' placeholder='메시지 입력...' value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
              <button className='px-3'>
                <svg xmlns='http://www.w3.org/2000/svg' className={`${msgInput.trim() === '' ? 'text-indigo-200' : 'text-indigo-500'} h-5 w-5`} viewBox='0 0 20 20' fill='currentColor'>
                  <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

export default Main;
