import { observable } from 'mobx';
import { AuthApiClient, DefaultConfiguration, OAuthCredential, ServiceApiClient, TalkClient } from 'node-kakao';
import { FetchWebClient } from 'node-kakao/src/api/fetch-web-client';
import { FriendStruct, MoreSettingsStruct } from 'node-kakao/src/api/struct';
import { Win32XVCProvider } from 'node-kakao/src/api/xvc';
import { version } from '../../package.json';

const clientObject = observable<{
  client: TalkClient;
  authApi: AuthApiClient;
  serviceApi: ServiceApiClient | undefined;
  credential: OAuthCredential | undefined;
  setCredential: (credential: OAuthCredential) => void;
  logon: boolean;
  setLogon: (logon: boolean) => void;
  moreSettings: MoreSettingsStruct | undefined;
  friendList: FriendStruct[] | undefined;
}>({
  client: new TalkClient(),
  authApi: new AuthApiClient(new FetchWebClient('https', 'katalk.kakao.com'), `qizz-${version}`, 'loco', DefaultConfiguration, Win32XVCProvider),
  serviceApi: undefined,
  credential: undefined,
  setCredential(credential) {
    this.credential = credential;
  },
  logon: false,
  setLogon(logon) {
    this.logon = logon;
  },
  moreSettings: undefined,
  friendList: undefined,
});

export default clientObject;
