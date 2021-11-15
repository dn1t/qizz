import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { OAuthCredential, ServiceApiClient } from 'node-kakao';
import { FriendListStruct } from 'node-kakao/src/api/struct';
import React from 'react';
import { ChatFill, GearFill, Github, PersonFill } from 'react-bootstrap-icons';
import store from '../store';
import querystring from 'querystring';
import axios from 'axios';
import Scrollbars from 'react-custom-scrollbars-2';

const { shell } = window.require('electron');

const requestFriendList = async (credential: OAuthCredential): Promise<FriendListStruct> =>
  (
    await axios.post(
      'https://katalk.kakao.com/win32/friends/update.json',
      querystring.stringify({
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
  const { clientObject } = store;

  reaction(
    () => clientObject.serviceApi,
    async (serviceApi: ServiceApiClient | undefined) => {
      const requestMoreSettingsRes = await serviceApi!.requestMoreSettings();
      console.log(requestMoreSettingsRes);
      if (requestMoreSettingsRes.success) clientObject.moreSettings = requestMoreSettingsRes.result;

      const requestFriendListRes = await requestFriendList(clientObject.credential!);
      console.log(requestFriendListRes);
      clientObject.friendList = requestFriendListRes.friends;
    }
  );

  return (
    <div className='flex px-5 py-4 gap-5 h-screen'>
      <div className='flex flex-col gap-2 h-full'>
        <div className='bg-indigo-600 rounded-xl px-3 py-2 flex flex-col items-center'>
          <div className='text-white text-xs font-semibold tracking-evenwider'>QIZZ</div>
        </div>
        <div className='bg-indigo-600 rounded-xl flex flex-col items-center h-full'>
          <div className='px-3 pt-5 pb-3 w-full flex justify-center'>
            <PersonFill className='text-white h-6 w-6' />
          </div>
          <div className='px-3 py-3 w-full flex justify-center'>
            <ChatFill className='text-white h-6 w-5' />
          </div>
          <div className='px-3 py-3 w-full flex justify-center'>
            <GearFill className='text-white h-6 w-5' />
          </div>
          <div className='px-3 pt-3 pb-5 mt-auto w-full flex justify-center cursor-pointer' onClick={() => shell.openExternal('https://github.com/thoratica/qizz')}>
            <Github className='text-white h-6 w-5' />
          </div>
        </div>
      </div>
      <div className='flex flex-col w-56 h-full'>
        <h1 className='text-2xl font-bold'>친구</h1>
        <Scrollbars className='flex flex-col h-full w-full mt-2'>
          <div className='flex flex-col'>
            <div className='flex flex-col items-center justify-center pt-4 pb-6 border-b border-gray-100 bg-white'>
              <div className='h-16 w-16 bg-contain rounded-full border border-gray-100' style={{ backgroundImage: `url('${clientObject.moreSettings?.fullProfileImageUrl}')` }} />
              <div className='text-2xl font-bold leading-none mt-2.5'>{clientObject.moreSettings?.nickName ?? '(알 수 없음)'}</div>
              <div className='leading-none mt-0.5 text-gray-400'>{clientObject.moreSettings?.uuid === undefined ? undefined : `@${clientObject.moreSettings.uuid}`}</div>
            </div>
            <div className='text-gray-400 text-sm font-medium sticky top-0 bg-white py-2'>친구 {clientObject.friendList?.length ?? 0}명</div>
            <div className='flex flex-col h-full'>
              {clientObject.friendList?.map((friend, index) => (
                <div className='flex px-1.5 hover:bg-gray-100 py-3 w-full rounded-xl gap-2 items-center'>
                  <div className='h-10 w-10 rounded-full bg-contain border-gray-200 flex-shrink-0' style={{ backgroundImage: `url('${friend.fullProfileImageUrl}')` }} />
                  <div className='block w-full max-w-full overflow-hidden'>
                    <div className='leading-none text-md font-medium truncate'>{friend.nickName}</div>
                    <div className='leading-none text-sm truncate'>{friend.statusMessage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
});

export default Main;
