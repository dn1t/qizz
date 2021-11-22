import { reaction } from 'mobx';
import React, { forwardRef, useRef } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import store from '../store';
import Chat from './Chat';

const ChatList = () => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  reaction(
    () => store.selected,
    (selected) => virtuosoRef.current?.scrollToIndex(store.chatList[selected.id!.toString()]?.length ?? 0)
  );

  const channel = store.channelList.find((channel) => channel.channelId.toString() === store.selected.id?.toString());
  if (channel === undefined) return <></>;
  const chatList = store.chatList[channel.channelId.toString()];
  if (chatList === undefined) return <></>;

  return (
    <Virtuoso
      className='relative z-20 scrollbar scrollbar-thumb-indigo-300 scrollbar-track-transparent scrollbar-thumb-rounded-xl'
      ref={virtuosoRef}
      data={chatList}
      itemContent={(index, chat) => <Chat chat={chat} prevChat={chatList[index - 1]} channel={channel} />}
      rangeChanged={() => {}}
      initialTopMostItemIndex={chatList.length}
      components={{
        List: forwardRef((props, ref) => <div {...props} ref={ref} className='px-4' />),
        Header: () => <div className='w-full h-3' />,
        Footer: () => <div className='w-full h-3' />,
      }}
    />
  );
};

export default ChatList;
