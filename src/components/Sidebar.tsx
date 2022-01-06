import type { BrowserWindow } from 'electron';
import { Long } from 'bson';
import React, { useState } from 'react';
import { ChatFill, GearFill, Github, PersonFill, XCircleFill } from 'react-bootstrap-icons';
import Scrollbars from 'react-custom-scrollbars-2';
import store from '../store';
import profileLight from '../profile_light.png';
import profileDark from '../profile_dark.png';
import { observer } from 'mobx-react-lite';

const { shell } = window.require('electron');
const { getCurrentWindow } = window.require('@electron/remote');

const win = getCurrentWindow() as BrowserWindow;

const Sidebar = observer(() => {
  const [defaultProfileImage] = useState(store.darkmode ? profileDark : profileLight);

  return (
    <>
      <div className='flex flex-col gap-2 h-full flex-shrink-0 pl-4 py-4'>
        <div className='bg-indigo-500 rounded-xl px-3 py-2 flex flex-col items-center drag select-none'>
          <div className='text-white text-xs font-semibold tracking-evenwider'>QIZZ</div>
        </div>
        <div className='bg-indigo-500 rounded-xl flex flex-col items-center h-full drag'>
          <div
            className='px-3 pt-5 pb-3 w-full flex justify-center no-drag'
            onClick={() => {
              if (store.category !== 'friends') store.category = 'friends';
            }}
          >
            <PersonFill className='text-white h-6 w-6' />
          </div>
          <div
            className='px-3 py-3 w-full flex justify-center no-drag'
            onClick={() => {
              if (store.category !== 'chats') store.category = 'chats';
            }}
          >
            <ChatFill className='text-white h-6 w-5' />
          </div>
          <div
            className='px-3 py-3 w-full flex justify-center no-drag'
            onClick={() => {
              if (store.category !== 'settings') store.category = 'settings';
            }}
          >
            <GearFill className='text-white h-6 w-5' />
          </div>
          <div className='px-3 pt-4 pb-2 mt-auto w-full flex justify-center cursor-pointer no-drag' onClick={() => shell.openExternal('https://github.com/thoratica/qizz')}>
            <Github className='text-white h-6 w-5' />
          </div>
          <div className='px-3 pt-2 pb-5 w-full flex justify-center no-drag' onClick={() => win.close()}>
            <XCircleFill className='text-white h-6 w-5' />
          </div>
        </div>
      </div>
      <div className='flex flex-col w-56 h-full flex-shrink-0 pt-4'>
        <h1 className='text-2xl font-bold px-3 drag'>{store.category === 'friends' ? '친구' : store.category === 'chats' ? '채팅' : store.category === 'settings' ? '설정' : store.category}</h1>
        <Scrollbars className='flex flex-col h-full w-full mt-2' autoHide>
          <div className='flex flex-col'>
            {store.category === 'friends' ? (
              <>
                <div className='px-3'>
                  <div className='flex flex-col items-center justify-center pt-4 pb-6 box-content border-b border-gray-100 bg-white'>
                    <div
                      className='h-16 w-16 bg-cover bg-no-repeat bg-center rounded-xl border border-gray-100'
                      style={{ backgroundImage: `url('${store.moreSettings?.fullProfileImageUrl === '' ? defaultProfileImage : store.moreSettings?.fullProfileImageUrl}')` }}
                    />
                    <div className='text-2xl font-bold leading-none mt-2.5'>{store.moreSettings?.nickName ?? '(알 수 없음)'}</div>
                    <div className='leading-none mt-0.5 text-gray-400'>{store.moreSettings?.uuid === undefined ? undefined : `@${store.moreSettings.uuid}`}</div>
                  </div>
                </div>
                <div className='text-gray-400 text-sm font-medium sticky top-0 bg-white px-3 py-2'>친구 {store.friendList?.length ?? 0}명</div>
                <div className='flex flex-col h-full'>
                  {store.friendList?.map((friend, index) => (
                    <div
                      className='flex px-3 py-2.5 my-0.5 w-full rounded-xl gap-2 items-center hover:bg-indigo-50 transition-colors'
                      onClick={() => {
                        if (store.selected.id?.toString() !== friend.userId.toString()) store.selected = { id: Long.fromString(friend.userId.toString()), category: 'friend' };
                      }}
                      key={index}
                    >
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
                {store.channelList
                  .slice()
                  .sort(
                    (a, b) =>
                      Number((store.chatList[b.channelId.toString()] ?? [])[(store.chatList[b.channelId.toString()]?.length ?? 1) - 1]?.sendAt.toString().padEnd(13, '0')) -
                      Number((store.chatList[a.channelId.toString()] ?? [])[(store.chatList[a.channelId.toString()]?.length ?? 1) - 1]?.sendAt.toString().padEnd(13, '0'))
                  )
                  .map((channel, index) => {
                    const chatList = store.chatList[channel.channelId.toString()] ?? [];
                    const firstFourMemberList = Array.from(channel.getAllUserInfo()).slice(0, 4);

                    return (
                      <div
                        className='flex p-3 my-0.5 w-full rounded-xl gap-2 items-center hover:bg-indigo-50 transition-colors'
                        onClick={() => {
                          if (store.selected.id?.toString() !== channel.channelId.toString()) store.selected = { id: channel.channelId, category: 'chat' };
                        }}
                        key={index}
                      >
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
                <div className='px-3'>
                  <div className='flex flex-col items-center justify-center pt-4 pb-6 box-content border-b border-gray-100 bg-white'>
                    <div
                      className='h-16 w-16 bg-cover bg-no-repeat bg-center rounded-xl border border-gray-100'
                      style={{ backgroundImage: `url('${store.moreSettings?.fullProfileImageUrl === '' ? defaultProfileImage : store.moreSettings?.fullProfileImageUrl}')` }}
                    />
                    <div className='text-2xl font-bold leading-none mt-2.5'>{store.moreSettings?.nickName ?? '(알 수 없음)'}</div>
                    <div className='leading-none mt-0.5 text-gray-400'>{store.moreSettings?.uuid === undefined ? undefined : `@${store.moreSettings.uuid}`}</div>
                  </div>
                </div>
                <div className='text-gray-400 text-sm font-medium sticky top-0 bg-white px-3 py-2'>친구 {store.friendList?.length ?? 0}명</div>
                <div className='flex flex-col h-full'>
                  {store.friendList?.map((friend, index) => (
                    <div className='flex p-3 my-0.5 w-full rounded-xl gap-2 items-center hover:bg-indigo-50 transition-colors' onClick={() => (store.selected = { id: Long.fromString(friend.userId.toString()), category: 'friend' })} key={index}>
                      <div className='h-10 w-10 rounded-xl bg-cover bg-no-repeat bg-center border-gray-200 flex-shrink-0' style={{ backgroundImage: `url('${friend.fullProfileImageUrl === '' ? defaultProfileImage : friend.fullProfileImageUrl}')` }} />
                      <div className='block w-full max-w-full overflow-hidden'>
                        <div className='leading-none text-sm font-medium truncate'>{friend.nickName}</div>
                        <div className='leading-none text-xs truncate mt-0.5'>{friend.statusMessage}</div>
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
    </>
  );
});

export default Sidebar;
