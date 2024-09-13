export type GameType = "stryktipset" | "europatipset";

export interface StryktipsetRoot {
  draws: Draw[];
  error: any;
  requestInfo: RequestInfo;
  requestId: string;
  sessionId: any;
  deviceId: string;
  session: any;
  sessionUser: any;
  clientInfo: any;
}

export interface Draw {
  drawComment: string;
  extraInfo: any;
  drawState: string;
  fund: any;
  lastDateWithoutTimeOfDay: string;
  events: StryktipsetEvent[];
  jackpotItems: any;
  productName: string;
  productId: number;
  drawNumber: number;
  openTime: string;
  closeTime: string;
  turnover: string;
  sport: string;
  sportId: number;
  checksum: string;
}

export interface StryktipsetEvent {
  eventNumber: number;
  description: string;
  cancelled: boolean;
  extraInfo: any;
  eventTypeDescription: string;
  participantType: string;
  outcomes: any;
  odds: Odds;
  distribution: Distribution;
  newspaperAdvice: any;
  league: League;
  participants: Participant[];
  sportEventId: number;
  sportEventStart: string;
  sportEventStatus: string;
  favouriteOdds: FavouriteOdds;
  startOdds: StartOdds;
  randomResultProbability: RandomResultProbability;
  complementaryOdds: any;
  complementaryFavouriteOdds: any;
  providerIds: ProviderId[];
}

export interface Odds {
  home: string;
  draw: string;
  away: string;
}

export interface Distribution {
  date: string;
  refDate: string;
  home: string;
  draw: string;
  away: string;
  refHome: string;
  refDraw: string;
  refAway: string;
}

export interface League {
  id: number;
  name: string;
  season: Season;
  country: Country;
}

export interface Season {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface Participant {
  id: number;
  type: string;
  name: string;
}

export interface FavouriteOdds {
  home: string;
  draw: string;
  away: string;
}

export interface StartOdds {
  home: string;
  draw: string;
  away: string;
}

export interface RandomResultProbability {
  home: string;
  draw: string;
  away: string;
}

export interface ProviderId {
  provider: string;
  type: string;
  id: string;
}

export interface RequestInfo {
  elapsedTime: number;
  apiVersion: number;
}
