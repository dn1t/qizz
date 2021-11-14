import { action, makeAutoObservable, makeObservable, observable } from 'mobx';
import { AuthApiClient, DefaultConfiguration, OAuthCredential, TalkClient } from 'node-kakao';
import { FetchWebClient } from 'node-kakao/src/api/fetch-web-client';
import { Win32XVCProvider } from 'node-kakao/src/api/xvc';
import { version } from '../../package.json';

const clientObject = observable<{ client: TalkClient; authApi: AuthApiClient; credential: OAuthCredential | undefined; setCredential: (credential: OAuthCredential) => void; logon: boolean; setLogon: (logon: boolean) => void }>({
  client: new TalkClient(),
  authApi: new AuthApiClient(new FetchWebClient('https', 'katalk.kakao.com'), `qizz-${version}`, 'loco', DefaultConfiguration, Win32XVCProvider),
  credential: undefined,
  setCredential(credential) {
    this.credential = credential;
  },
  logon: false,
  setLogon(logon) {
    this.logon = logon;
  },
});

export default clientObject;
