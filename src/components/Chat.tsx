import { Chatlog, KnownChatType, TalkChannel } from 'node-kakao';
import React from 'react';
import Linkify from 'linkify-react';
import { ExclamationCircle } from 'react-bootstrap-icons';
import store from '../store';

const { shell } = window.require('electron');

const getTypeString = (type: KnownChatType) => (KnownChatType[type] === undefined ? type.toString() : `${KnownChatType[type]} (${type})`);

const Chat = ({ chat, prevChat, channel }: { chat: Chatlog; prevChat: Chatlog | undefined; channel: TalkChannel }) => {
  const byMe = chat.sender.userId.toString() === store.client.clientUser.userId.toString();
  const hideName = byMe ? true : prevChat?.sender.userId.toString() === chat.sender.userId.toString();
  const userInfo = channel.getUserInfo(chat.sender);

  if (chat.type === KnownChatType.FEED) {
    return (
      <div className={!hideName ? 'mt-2' : 'mt-1'}>
        {!hideName && <div className='text-sm font-medium pl-0.5 mb-0.5'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
        <div className={`${byMe ? 'bg-indigo-500' : 'bg-indigo-50'} flex flex-col w-max max-w-full px-3 py-1.5 rounded-xl`}>
          <Linkify
            options={{
              className: 'break-all text-indigo-600',
              attributes: {
                onClick: (e: MouseEvent) => {
                  e.preventDefault();
                  shell.openExternal((e.target as HTMLAnchorElement).href);
                },
              },
            }}
          >
            {chat.text}
          </Linkify>
        </div>
      </div>
    );
  } else if (chat.type === KnownChatType.TEXT) {
    return (
      <div className={!hideName ? 'mt-2' : 'mt-1'}>
        {!hideName && <div className='text-sm font-medium pl-0.5 mb-0.5'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
        <div className={`${byMe ? 'bg-indigo-500' : 'bg-indigo-50'} flex flex-col w-max max-w-full px-3 py-1.5 rounded-xl`}>
          <Linkify
            options={{
              className: 'break-all text-indigo-600',
              attributes: {
                onClick: (e: MouseEvent) => {
                  e.preventDefault();
                  shell.openExternal((e.target as HTMLAnchorElement).href);
                },
              },
            }}
          >
            {chat.text}
          </Linkify>
        </div>
      </div>
    );
  } else if (chat.type === KnownChatType.PHOTO) {
    const image = chat.attachment as any;

    return (
      <div className={!hideName ? 'mt-2' : 'mt-1'}>
        {!hideName && <div className='text-sm font-medium pl-0.5 mb-0.5'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
        <div className='flex flex-col w-max max-w-full py-1.5 rounded-xl'>
          <img src={image.url} className='rounded-xl bg-indigo-50 max-w-full max-h-72' />
        </div>
      </div>
    );
  } else {
    return (
      <div className={!hideName ? 'mt-2' : 'mt-1'}>
        {!hideName && <div className='text-sm font-medium pl-0.5 mb-0.5'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
        <div className={`${byMe ? 'bg-indigo-500' : 'bg-indigo-50'} flex flex-col w-max max-w-full px-3 py-1.5 rounded-xl`}>
          <div className='flex items-center gap-2'>
            <ExclamationCircle className='mb-0.5' fill={'#6b7280'} />
            <div className='flex flex-col'>
              <div className='text-gray-500 font-medium'>현재 버전에서 지원되지 않는 타입의 메시지입니다.</div>
              <div className='text-gray-500 text-sm font-medium leading-none mb-0.5'>메시지 타입: {getTypeString(chat.type)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Chat;
