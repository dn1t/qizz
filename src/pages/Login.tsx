import { observer } from 'mobx-react-lite';
import { DefaultConfiguration, KnownAuthStatusCode, ServiceApiClient } from 'node-kakao';
import { SessionWebClient } from 'node-kakao/src/api';
import { FetchWebClient } from 'node-kakao/src/api/fetch-web-client';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import store from '../store';

const Login = observer(() => {
  const { client, authApi } = store;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forceLogin, setForceLogin] = useState(false);
  const [passcode, setPasscode] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const registerDevice = async (e = email, p = password) =>
    await toast.promise(
      new Promise(async (res, rej) => {
        const registerDeviceRes = await authApi.registerDevice({ email: e, password: p }, passcode, true);
        if (!registerDeviceRes.success) return rej(KnownAuthStatusCode[registerDeviceRes.status] ?? registerDeviceRes.status);
        return res(undefined);
      }),
      { loading: '기기를 등록하는 중입니다...', success: '기기 등록을 성공했습니다!', error: (err) => `에러: ${err}` }
    );

  const login = async (e = email, p = password, isAuto = false) =>
    await toast.promise(
      new Promise(async (res, rej) => {
        const apiLoginRes = await authApi.login({ email: e, password: p }, forceLogin);
        if (!apiLoginRes.success) return rej(KnownAuthStatusCode[apiLoginRes.status] ?? apiLoginRes.status);

        store.credential = apiLoginRes.result;
        const loginRes = await client.login(apiLoginRes.result);
        if (!loginRes.success) return rej(KnownAuthStatusCode[loginRes.status] ?? loginRes.status);

        store.logon = true;
        store.serviceApi = new ServiceApiClient(new SessionWebClient(new FetchWebClient('https', 'katalk.kakao.com'), apiLoginRes.result, DefaultConfiguration));
        return res(undefined);
      }),
      { loading: `${isAuto ? '자동 로그인' : '로그인'}을 하는 중입니다...`, success: `${isAuto ? '자동 로그인' : '로그인'}을 성공했습니다!`, error: (err) => `에러: ${err}` }
    );

  useEffect(() => {
    if (localStorage.email !== undefined) {
      if (localStorage.password !== undefined) {
        setEmail(localStorage.email);
        setPassword(localStorage.password);
        login(localStorage.email, localStorage.password, true);
      } else {
        setEmail(localStorage.email);
        passwordInputRef.current?.focus();
      }
    }
  }, []);

  return (
    <div className='flex h-screen'>
      <div className='bg-gradient-to-b from-indigo-500 to-indigo-500 flex items-center justify-center w-1/3'>
        <div className='w-2/3 flex flex-col'>
          <div className='text-white text-xl font-bold tracking-evenevenwider'>QIZZ</div>
          <div className='text-white text-3xl font-bold' style={{ wordBreak: 'keep-all' }}>
            새로운 카카오톡 클라이언트
          </div>
          <div className='text-white mt-2'>내일학교가기싫다내일학교가기싫다내일학교가기싫다내일학교가기싫다내일학교가기싫다내일학교가기싫다내일학교가기싫다내일학교가기싫다내일학교가기싫다내일학교가기싫다</div>
        </div>
      </div>
      <div className='flex items-center justify-center w-2/3'>
        <form
          className='flex flex-col w-1/2'
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <div className='font-bold text-3xl'>👋 반가워요!</div>
          <div className='flex flex-col mt-4 gap-1.5'>
            <label className='flex flex-col mb-1'>
              <span className='font-medium'>이메일 주소</span>
              <input
                className='mt-0.5 bg-gray-100 focus:bg-gray-50 border border-gray-100 focus:border-indigo-500 ring-0 focus:ring-4 focus:ring-indigo-200 focus:outline-none px-4 py-2.5 rounded-md transition-all'
                type='email'
                placeholder='foo@kakao.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </label>
            <label className='flex flex-col mb-1'>
              <span className='font-medium'>비밀번호</span>
              <input
                className='mt-0.5 bg-gray-100 focus:bg-gray-50 border border-gray-100 focus:border-indigo-500 ring-0 focus:ring-4 focus:ring-indigo-200 focus:outline-none px-4 py-2.5 rounded-md transition-all'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordInputRef}
              />
            </label>
          </div>
          <button className='mt-3 bg-indigo-500 px-4 py-2.5 rounded-md text-white font-medium border-indigo-500 focus:ring-4 focus:ring-indigo-200 focus:outline-none'>로그인</button>
        </form>
      </div>
    </div>
  );
});

export default Login;
