import type { BrowserWindow } from 'electron';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { OAuthCredential, ServiceApiClient } from 'node-kakao';
import { FriendListStruct } from 'node-kakao/src/api/struct';
import React, { useState } from 'react';
import { ChatFill, GearFill, Github, PersonFill, XCircleFill } from 'react-bootstrap-icons';
import store from '../store';
import qs from 'querystring';
import axios from 'axios';
import Scrollbars from 'react-custom-scrollbars-2';
import profileLight from '../profile_light.png';
import profileDark from '../profile_dark.png';

const { shell } = window.require('electron');
const { getCurrentWindow } = window.require('@electron/remote');

const win = getCurrentWindow() as BrowserWindow;

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
  const [defaultProfileImage, setDefaultProfileImage] = useState(store.darkmode ? profileDark : profileLight);

  reaction(
    () => store.serviceApi,
    async (serviceApi: ServiceApiClient | undefined) => {
      const requestMoreSettingsRes = await serviceApi!.requestMoreSettings();
      console.log(requestMoreSettingsRes);
      if (requestMoreSettingsRes.success) store.moreSettings = requestMoreSettingsRes.result;

      const requestFriendListRes = await requestFriendList(store.credential!);
      console.log(requestFriendListRes);
      store.friendList = requestFriendListRes.friends;
    }
  );

  return (
    <div className='flex px-5 py-4 gap-5 h-screen'>
      <div className='flex flex-col gap-2 h-full'>
        <div className='bg-indigo-600 rounded-xl px-3 py-2 flex flex-col items-center drag select-none'>
          <div className='text-white text-xs font-semibold tracking-evenwider'>QIZZ</div>
        </div>
        <div className='bg-indigo-600 rounded-xl flex flex-col items-center h-full'>
          <div
            className='px-3 pt-5 pb-3 w-full flex justify-center'
            onClick={() => {
              if (store.category !== 'friends') store.category = 'friends';
            }}
          >
            <PersonFill className='text-white h-6 w-6' />
          </div>
          <div
            className='px-3 py-3 w-full flex justify-center'
            onClick={() => {
              if (store.category !== 'chats') store.category = 'chats';
            }}
          >
            <ChatFill className='text-white h-6 w-5' />
          </div>
          <div
            className='px-3 py-3 w-full flex justify-center'
            onClick={() => {
              if (store.category !== 'settings') store.category = 'settings';
            }}
          >
            <GearFill className='text-white h-6 w-5' />
          </div>
          <div className='px-3 pt-4 pb-2 mt-auto w-full flex justify-center cursor-pointer' onClick={() => shell.openExternal('https://github.com/thoratica/qizz')}>
            <Github className='text-white h-6 w-5' />
          </div>
          <div className='px-3 pt-2 pb-5 w-full flex justify-center' onClick={() => win.close()}>
            <XCircleFill className='text-white h-6 w-5' />
          </div>
        </div>
      </div>
      <div className='flex flex-col w-56 h-full'>
        <h1 className='text-2xl font-bold'>{store.category === 'friends' ? '친구' : store.category === 'chats' ? '채팅' : store.category === 'settings' ? '설정' : store.category}</h1>
        <Scrollbars className='flex flex-col h-full w-full mt-2' autoHide>
          <div className='flex flex-col'>
            {store.category === 'friends' ? (
              <>
                <div className='flex flex-col items-center justify-center pt-4 pb-6 box-content border-b border-gray-100 bg-white'>
                  <div
                    className='h-16 w-16 bg-cover bg-no-repeat bg-center rounded-xl border border-gray-100'
                    style={{ backgroundImage: `url('${store.moreSettings?.fullProfileImageUrl === '' ? defaultProfileImage : store.moreSettings?.fullProfileImageUrl}')` }}
                  />
                  <div className='text-2xl font-bold leading-none mt-2.5'>{store.moreSettings?.nickName ?? '(알 수 없음)'}</div>
                  <div className='leading-none mt-0.5 text-gray-400'>{store.moreSettings?.uuid === undefined ? undefined : `@${store.moreSettings.uuid}`}</div>
                </div>
                <div className='text-gray-400 text-sm font-medium sticky top-0 bg-white py-2'>친구 {store.friendList?.length ?? 0}명</div>
                <div className='flex flex-col h-full'>
                  {store.friendList?.map((friend, index) => (
                    <div className='flex py-3 w-full rounded-xl gap-2 items-center' key={index}>
                      <div className='h-10 w-10 rounded-xl bg-cover bg-no-repeat bg-center border-gray-200 flex-shrink-0' style={{ backgroundImage: `url('${friend.fullProfileImageUrl === '' ? defaultProfileImage : friend.fullProfileImageUrl}')` }} />
                      <div className='block w-full max-w-full overflow-hidden'>
                        <div className='leading-none text-sm font-medium truncate'>{friend.nickName}</div>
                        <div className='leading-none text-xs truncate mt-0.5'>{friend.statusMessage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : store.category === 'chats' ? (
              <div className='flex flex-col h-full'>
                {store.channelList.map((channel, index) => {
                  const chatList = store.chatList[channel.channelId.toString()] ?? [];
                  const firstFourMemberList = Array.from(channel.getAllUserInfo()).slice(0, 4);

                  return (
                    <div className='flex py-3 w-full rounded-xl gap-2 items-center h-16' key={index}>
                      <div className='h-10 w-10 rounded-xl bg-contain border-gray-200 flex-shrink-0 flex flex-wrap'>
                        {firstFourMemberList.map((member, index) => {
                          return (
                            <div
                              className={`${
                                firstFourMemberList.length === 1
                                  ? 'h-10 w-10 rounded-xl'
                                  : `h-5 ${
                                      firstFourMemberList.length === 2
                                        ? `w-10 ${index === 0 ? 'rounded-t-xl' : index === 1 ? 'rounded-b-xl' : ''}`
                                        : firstFourMemberList.length === 3
                                        ? index === 0
                                          ? 'w-10 rounded-t-xl'
                                          : `w-5 ${index === 1 ? 'rounded-bl-xl' : index === 2 ? 'rounded-br-xl' : ''}`
                                        : firstFourMemberList.length === 4
                                        ? `w-5 ${index === 0 ? 'rounded-tl-xl' : index === 1 ? 'rounded-tr-xl' : index === 2 ? 'rounded-bl-xl' : index === 3 ? 'rounded-br-xl' : ''}`
                                        : ''
                                    }`
                              } bg-cover bg-no-repeat bg-center border-gray-200 flex-shrink-0`}
                              style={{ backgroundImage: `url('${member.fullProfileURL === '' ? defaultProfileImage : member.fullProfileURL}')` }}
                              key={index}
                            />
                          );
                        })}
                      </div>
                      <div className='block w-full max-w-full overflow-hidden'>
                        <div className='flex gap-1'>
                          <div className='leading-none text-sm font-medium truncate'>{channel.getDisplayName()}</div>
                          <span className='text-xs text-gray-400 font-normal'>{channel.userCount}</span>
                        </div>
                        <div className='leading-none text-xs truncate mt-0.5'>{chatList[chatList.length - 1]?.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : store.category === 'settings' ? (
              <>
                <div className='text-gray-400 text-sm font-medium sticky top-0 bg-white py-2'>친구 {store.friendList?.length ?? 0}명</div>
                <div className='flex flex-col h-full'>
                  {store.friendList?.map((friend, index) => (
                    <div className='flex px-1.5 hover:bg-gray-50 transition-colors py-3 w-full rounded-xl gap-2 items-center' key={index}>
                      <div className='h-10 w-10 rounded-full bg-contain border-gray-200 flex-shrink-0' style={{ backgroundImage: `url('${friend.fullProfileImageUrl}')` }} />
                      <div className='block w-full max-w-full overflow-hidden'>
                        <div className='leading-none text-md font-medium truncate'>{friend.nickName}</div>
                        <div className='leading-none text-sm truncate'>{friend.statusMessage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>알 수 없는 카테고리입니다.</div>
            )}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
});

export default Main;
