import { Chatlog, KnownChatType, ReplyAttachment, TalkChannel } from 'node-kakao';
import React, { RefObject, useState } from 'react';
import Linkify from 'linkify-react';
import { ExclamationCircle } from 'react-bootstrap-icons';
import { observer } from 'mobx-react-lite';
import { VirtuosoHandle } from 'react-virtuoso';
import store from '../store';
import profileLight from '../profile_light.png';
import profileDark from '../profile_dark.png';

const { shell } = window.require('electron');

const getTypeString = (type: KnownChatType) => (KnownChatType[type] === undefined ? type.toString() : `${KnownChatType[type]} (${type})`);

const Chat = observer(({ chat, prevChat, channel, virtuosoRef }: { chat: Chatlog; prevChat: Chatlog | undefined; channel: TalkChannel; virtuosoRef: RefObject<VirtuosoHandle> }) => {
  const [defaultProfileImage] = useState(store.darkmode ? profileDark : profileLight);
  const byMe = chat.sender.userId.toString() === store.client.clientUser.userId.toString();
  const hideName = byMe ? true : prevChat?.sender.userId.toString() === chat.sender.userId.toString();
  const userInfo = channel.getUserInfo(chat.sender);

  if (chat.type === KnownChatType.FEED) {
    return (
      <div className={`${!hideName ? 'mt-2' : 'mt-1'} flex`} data-id={chat.logId.toString()}>
        {!hideName && <div className='rounded-xl w-10 h-10 bg-cover bg-no-repeat bg-center flex-shrink-0' style={{ backgroundImage: `url('${userInfo === undefined || userInfo.fullProfileURL === '' ? defaultProfileImage : userInfo.fullProfileURL}')` }} />}
        {hideName && <div className='w-10 h-px flex-shrink-0' />}
        <div className='flex flex-col ml-2 w-full'>
          {!hideName && <div className='text-sm font-medium pl-0.5 mb-0.5'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
          <div className={`${byMe ? 'bg-indigo-500 text-white ml-auto' : 'bg-indigo-100'} flex flex-col w-max max-w-full px-3 py-1.5 rounded-xl`}>
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
      </div>
    );
  } else if (chat.type === KnownChatType.TEXT) {
    return (
      <div className={`${!hideName ? 'mt-2' : 'mt-1'} flex w-full`} data-id={chat.logId.toString()}>
        {!hideName && <div className='rounded-xl w-10 h-10 bg-cover bg-no-repeat bg-center flex-shrink-0' style={{ backgroundImage: `url('${userInfo === undefined || userInfo.fullProfileURL === '' ? defaultProfileImage : userInfo.fullProfileURL}')` }} />}
        {hideName && <div className='w-10 h-px flex-shrink-0' />}
        <div className='flex flex-col ml-2 w-full'>
          {!hideName && <div className='text-sm font-medium pl-0.5 mb-0.5'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
          <div className={`${byMe ? 'bg-indigo-500 text-white ml-auto' : 'bg-indigo-100'} flex flex-col w-max max-w-full px-3 py-1.5 rounded-xl`}>
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
      </div>
    );
  } else if (chat.type === KnownChatType.PHOTO) {
    const image = chat.attachment as any;

    return (
      <div className={`${!hideName ? 'mt-2' : 'mt-1'} flex w-full`} data-id={chat.logId.toString()}>
        {!hideName && <div className='rounded-xl w-10 h-10 bg-cover bg-no-repeat bg-center flex-shrink-0' style={{ backgroundImage: `url('${userInfo === undefined || userInfo.fullProfileURL === '' ? defaultProfileImage : userInfo.fullProfileURL}')` }} />}
        {hideName && <div className='w-10 h-px flex-shrink-0' />}
        <div className='flex flex-col ml-2 w-full'>
          {!hideName && <div className='text-sm font-medium pl-0.5 mb-px'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
          <div className='flex flex-col w-max max-w-full pb-1.5 rounded-xl'>
            <img src={image.url} className='rounded-xl bg-indigo-100 max-w-full max-h-72' />
          </div>
        </div>
      </div>
    );
  } else if (chat.type === KnownChatType.REPLY) {
    const reply = chat.attachment as ReplyAttachment;

    return (
      <div className={`${!hideName ? 'mt-2' : 'mt-1'} flex w-full`} data-id={chat.logId.toString()}>
        {!hideName && <div className='rounded-xl w-10 h-10 bg-cover bg-no-repeat bg-center flex-shrink-0' style={{ backgroundImage: `url('${userInfo === undefined || userInfo.fullProfileURL === '' ? defaultProfileImage : userInfo.fullProfileURL}')` }} />}
        {hideName && <div className='w-10 h-px flex-shrink-0' />}
        <div className='flex flex-col ml-2 w-full'>
          {!hideName && <div className='text-sm font-medium pl-0.5 mb-0.5'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
          <div className={`${byMe ? 'bg-indigo-500 text-white ml-auto' : 'bg-indigo-100'} flex flex-col w-max max-w-full px-1.5 py-1.5 rounded-xl`}>
            <div
              className='bg-indigo-50 mx-0.5 mt-0.5 mb-1 rounded-lg px-2.5 py-1.5'
              onClick={() => {
                virtuosoRef.current?.scrollIntoView({ index: Number(store.chatList[channel.channelId.toString()].findIndex((c) => c.logId.toString() === reply.src_logId.toString())), behavior: 'smooth' });
              }}
            >
              <div className='text-xs leading-none'>
                <span className='font-semibold'>{channel.getUserInfo({ userId: reply.src_userId })?.nickname ?? '(알 수 없음)'}</span>
                <span>에게 답장</span>
              </div>
              <div className='text-sm leading-none'>{reply.src_message}</div>
            </div>
            <div className='mx-1.5'>
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
        </div>
      </div>
    );
  } else {
    return (
      <div className={`${!hideName ? 'mt-2' : 'mt-1'} flex`} data-id={chat.logId.toString()}>
        {!hideName && <div className='rounded-xl w-10 h-10 bg-cover bg-no-repeat bg-center flex-shrink-0' style={{ backgroundImage: `url('${userInfo === undefined || userInfo.fullProfileURL === '' ? defaultProfileImage : userInfo.fullProfileURL}')` }} />}
        {hideName && <div className='w-10 h-px flex-shrink-0' />}
        <div className='flex flex-col ml-2 w-full'>
          {!hideName && <div className='text-sm font-medium pl-0.5 mb-0.5'>{userInfo?.nickname ?? '(알 수 없음)'}</div>}
          <div className={`${byMe ? 'bg-indigo-500' : 'bg-indigo-100'} flex flex-col w-max max-w-full px-3 py-1.5 rounded-xl`}>
            <div className='flex items-center gap-2'>
              <ExclamationCircle className='mb-0.5' fill={'#6b7280'} />
              <div className='flex flex-col'>
                <div className='text-gray-500 font-medium'>현재 버전에서 지원되지 않는 타입의 메시지입니다.</div>
                <div className='text-gray-500 text-sm font-medium leading-none mb-0.5'>메시지 타입: {getTypeString(chat.type)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Chat;
