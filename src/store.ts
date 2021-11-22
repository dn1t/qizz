import { observable } from 'mobx';
import { AuthApiClient, Chatlog, DefaultConfiguration, Long, OAuthCredential, ServiceApiClient, TalkChannel, TalkClient } from 'node-kakao';
import { FetchWebClient } from 'node-kakao/src/api/fetch-web-client';
import { FriendStruct, MoreSettingsStruct } from 'node-kakao/src/api/struct';
import { Win32XVCProvider } from 'node-kakao/src/api/xvc';
import { version } from '../package.json';

const store = observable<{
  client: TalkClient;
  authApi: AuthApiClient;
  serviceApi: ServiceApiClient | undefined;
  credential: OAuthCredential | undefined;
  setCredential: (credential: OAuthCredential) => void;
  logon: boolean;
  setLogon: (logon: boolean) => void;
  moreSettings: MoreSettingsStruct | undefined;
  friendList: FriendStruct[] | undefined;
  selected: { category: 'friend' | 'chat' | 'setting' | 'blank'; id?: Long };
  category: 'friends' | 'chats' | 'settings';
  channelList: TalkChannel[];
  chatList: { [id: string]: Chatlog[] };
  darkmode: boolean;
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
  selected: { category: 'blank' },
  category: 'friends',
  channelList: [],
  chatList: {},
  darkmode: false,
});

export default store;
