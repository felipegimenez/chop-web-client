import { GraphQLClient } from 'graphql-request';

declare var GATEWAY_HOST:string;

type AuthenticateType = {
  type: 'LegacyAuth' | 'BasicAuth' | 'Refresh',
  hostname: string,
  legacyToken?: string,
  refreshToken?: string,
  email?: string,
  password?: string
}

const accessToken = `
mutation AccessToken($type: String!, $email: String, $password: String, $legacyToken: String, $refreshToken: String) {
  authenticate(type: $type, email: $email, password: $password, legacyToken: $legacyToken, refreshToken: $refreshToken) {
    accessToken
    refreshToken
  }
}
`;

const sequence = `
query Sequence($time: Timestamp) {
  eventAt(time: $time) {
    sequence {
      serverTime
      steps {
        fetchTime
        transitionTime
        queries
      }
    }
  }
}`;

const currentEvent = `
currentEvent {
  id
  title
  speaker
  description
  hostInfo
  eventTime {
    id
  }
  startTime
  endTime
  videoStartTime
  sequence {
    serverTime
    steps {
      fetchTime
      queries
      transitionTime
    }
  }
  video {
    type
    url
  }
  feeds {
    id
    name
    type
    direct
    subscribers {
      pubnubToken
      avatar
      nickname
    }
  }
}`;

const eventAt = `
query EventAt($time: Timestamp) {
  eventAt (time: $time){
    id
    title
    speaker
    description
    hostInfo
    eventTime {
      id
    }
    startTime
    endTime
    videoStartTime
    video {
      type
      url
    }
    feeds {
      id
      name
      direct
      type
      subscribers {
        pubnubToken
        avatar
        nickname
      }
    }
  }
}`;

const currentUser = `
currentUser {
  id
  nickname
  avatar
  pubnubToken
  role {
    label
  }
}`;

const currentOrganization = `
currentOrganization {
  id
  name
}`;

const pubnubKeys = `
pubnubKeys {
  publishKey
  subscribeKey
}`;

const currentLanguages = `
currentLanguages {
  name
  code
}`;

const acceptPrayer = `
mutation AcceptPrayer($feedToken: String!, $requesterPubnubToken: String!, $hostTokens: [String!]!, $requesterNickname: String!) {
  acceptPrayer(feedToken: $feedToken, requesterPubnubToken: $requesterPubnubToken, hostTokens: $hostTokens, requesterNickname: $requesterNickname) {
    id
    name
    direct
    subscribers {
      pubnubToken
      avatar
      nickname
    }
  }
}
`;

const muteUser = ` 
mutation muteUser($feedToken: String!, $nickname: String!) {
  muteUser(feedToken: $feedToken, nickname: $nickname, clientIp: "0.0.0.0")
}
`;

const leaveChannel = `
mutation leaveFeed($feedToken: String!) {
  leaveFeed(feedToken: $feedToken)
}
`;

const createDirectFeed = `
mutation createDirectFeed($pubnubToken: String!, $nickname: String!) {
  createDirectFeed(targetPubnubToken: $pubnubToken, targetNickname: $nickname) {
    id
    name
    direct
    subscribers {
      pubnubToken
      avatar
      nickname
    }
  }
}`;

const schedule = `
schedule {
  fetchTime
  startTime
  endTime
  id
  title
  scheduleTime
  hostInfo
}`;

const currentState = `
query CurrentState {
  ${currentEvent}
  ${currentUser}
  ${currentOrganization}
  ${pubnubKeys}
  ${currentLanguages}
  ${schedule}
}`;

export default class GraphQl {
  client: GraphQLClient;

  async authenticate ({type, hostname, legacyToken, refreshToken, email, password}:AuthenticateType): Promise<void> {
    const client = new GraphQLClient(GATEWAY_HOST, {
      headers: {
        'Application-Domain': hostname,
      },
    });

    const data = await client.request(accessToken, {
      type,
      legacyToken,
      refreshToken,
      email,
      password,
    });

    this.setClient(data.authenticate.accessToken, hostname);

    return data;
  }

  setClient (accessToken:string, hostname:string) {
    this.client = new GraphQLClient(GATEWAY_HOST, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Application-Domain': hostname,
      },
    });
  }

  async authenticateByLegacyToken (legacyToken: string, hostname: string): Promise<void> {
    return await this.authenticate({
      type: 'LegacyAuth',
      hostname,
      legacyToken,
    });
  }

  async authenticateByBasicAuth (email: string, password: string, hostname: string): Promise<void> {
    return await this.authenticate({
      type: 'BasicAuth',
      hostname,
      email,
      password,
    });
  }

  async authenticateByRefreshToken (refreshToken: string, hostname: string): Promise<void> {
    return await this.authenticate({
      type: 'Refresh',
      hostname,
      refreshToken,
    });
  }

  async currentState (): Promise<any> {
    return await this.client.request(currentState);
  }

  async acceptPrayer (channelId: string, requesterPubnubToken: string, hostTokens: Array<string>, requesterName: string): Promise<any> {
    return await this.client.request(
      acceptPrayer,
      {
        feedToken: channelId,
        requesterPubnubToken,
        hostTokens,
        requesterNickname: requesterName,
      }
    );
  }

  async muteUser (feedToken: string, nickname: string) {
    return await this.client.request(
      muteUser,
      {
        feedToken,
        nickname,
      }
    );
  }

  async directChat (pubnubToken: string, nickname: string) {
    return await this.client.request(
      createDirectFeed,
      {
        pubnubToken,
        nickname,
      }
    );
  }

  async leaveChannel (channelId: string) {
    return await this.client.request(
      leaveChannel,
      {
        feedToken: channelId,
      }
    );
  }

  async schedule () {
    return await this.client.request(schedule);
  }

  async eventAtTime (time) {
    return await this.client.request(
      eventAt,
      {
        time,
      }
    );
  }

  async sequence (time) {
    return await this.client.request(
      sequence,
      {
        time,
      }
    );
  }
}
