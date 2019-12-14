/* eslint-disable quote-props */
export const POSITIONS = ['adc', 'mid', 'top', 'jungle', 'support'];

export const REGIONS = ['BR', 'EUNE', 'EUW', 'JP', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'TR', 'RU', 'PBE'];

export const GAMES = ['LOL', 'PUBG'];

export const RULES = {
  LOL: {
    player: [
      {
        ruleName: 'kills',
        description: 'Foes killed',
      }, {
        ruleName: 'assists',
        description: 'Assists count',
      }, {
        ruleName: 'deaths',
        description: 'Aw, snap',
      },
    ],
    match: [
      {
        ruleName: 'time',
        description: 'Match time',
      },
    ],
  },
  PUBG: {
    player: [
      {
        ruleName: 'kills',
        description: 'Foes killed',
      }, {
        ruleName: 'assists',
        description: 'Assists count',
      }, {
        ruleName: 'loot',
        description: 'How many bullets',
      },
    ],
    match: [
      {
        ruleName: 'time',
        description: 'Match time',
      },
    ],
  },
};

export const REWARD_POSITIONS = {
  'summoner_first': {
    role: 'summoner',
    place: 'first',
  },
  'summoner_second': {
    role: 'summoner',
    place: 'second',
  },
  'summoner_third': {
    role: 'summoner',
    place: 'third',
  },
  'viewer_first': {
    role: 'viewer',
    place: 'first',
  },
  'viewer_second': {
    role: 'viewer',
    place: 'second',
  },
  'viewer_third': {
    role: 'viewer',
    place: 'third',
  },
};
