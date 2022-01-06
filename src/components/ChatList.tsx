import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { forwardRef, useRef, useState } from 'react';
import { ArrowDown } from 'react-bootstrap-icons';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import store from '../store';
import Chat from './Chat';

const ChatList = observer(() => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [range, setRange] = useState(0);

  reaction(
    () => store.selected,
    (selected) => virtuosoRef.current?.scrollToIndex(store.chatList[selected.id!.toString()]?.length ?? 0)
  );

  const channel = store.channelList.find((channel) => channel.channelId.toString() === store.selected.id?.toString());
  if (channel === undefined) return <></>;
  const chatList = store.chatList[channel.channelId.toString()];
  if (chatList === undefined) return <></>;

  return (
    <>
      <Virtuoso
        className='relative z-20 scrollbar scrollbar-thumb-indigo-300 scrollbar-track-transparent scrollbar-thumb-rounded-xl'
        ref={virtuosoRef}
        data={chatList}
        itemContent={(index, chat) => <Chat chat={chat} prevChat={chatList[index - 1]} channel={channel} virtuosoRef={virtuosoRef} />}
        rangeChanged={(e) => setRange(e.endIndex)}
        initialTopMostItemIndex={chatList.length}
        components={{
          List: forwardRef((props, ref) => <div {...props} ref={ref} className='px-4' />),
          Header: () => <div className='w-full h-3' />,
          Footer: () => <div className='w-full h-3' />,
        }}
      />
      <div
        className={`${range === chatList.length - 1 ? 'opacity-0' : 'opacity-100'} transition-opacity absolute h-9 w-9 bg-indigo-100 border border-indigo-400 bottom-4 right-4 rounded-full flex items-center justify-center z-20`}
        onClick={() => virtuosoRef.current?.scrollBy({ top: Number.MAX_SAFE_INTEGER, behavior: 'smooth' })}
      >
        <ArrowDown className='text-indigo-600 h-4 w-4' />
      </div>
    </>
  );
});

export default ChatList;
