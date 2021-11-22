import React from 'react';
import store from '../store';

const TitleBar = () => {
  if (store.selected.category === 'friend') {
    return (
      <div className='w-full bg-white rounded-b-xl px-1 pt-3 drag'>
        <div className='text-2xl text-whie font-bold'>{store.friendList?.find((friend) => friend.userId.toString() === store.selected.id?.toString())?.nickName ?? '(알 수 없음)'}</div>
      </div>
    );
  } else if (store.selected.category === 'chat') {
    return (
      <div className='w-full bg-white rounded-b-xl px-1 pt-3 drag'>
        <div className='text-2xl font-bold'>{store.channelList.find((channel) => channel.channelId.toString() === store.selected.id?.toString())?.getDisplayName() ?? '(알 수 없음)'}</div>
      </div>
    );
  } else if (store.selected.category === 'setting') {
    return (
      <div className='w-full bg-white rounded-b-xl px-1 pt-3 drag'>
        <div className='text-2xl font-bold'>친구</div>
      </div>
    );
  } else {
    return <div className='pb-4'></div>;
  }
};

export default TitleBar;
