import {z} from 'zod';
import {Player} from '../player/player.model';

export const SingleProfileSchema = z.object({
  profile_id: z.string().uuid(),
  members: z.record(
    z.string().regex(/^[a-f0-9]{32}$/), // Key is player's UUID
    z.unknown()
  ),
  game_mode: z.enum(['ironman', 'bingo', 'stranded']).optional(),
})

export interface SingleProfile {
  profile_id: string;
  members: Record<string, unknown>;
  game_mode?: 'ironman' | 'bingo' | 'stranded';
}

export interface IMemberData {
  player_id: string,
  mining_core: {
    nodes: Record<string, number>,
    // tokens_spent: number, // Do I even need this?
    powder_mithril: number, // total of powder X = powder_X + powder_spent_X
    powder_spent_mithril: number, // no idea what powder_X_total does
    powder_gemstone: number,
    powder_spent_gemstone: number,
    powder_glacite: number,
    powder_spent_glacite: number,
    experience: number,
  }
}


class PowderData {
  have: number;
  spent: number;
  total: number;
  type: PowderType

  constructor(have: number, spent: number, type: PowderType) {
    this.have = have;
    this.spent = spent;
    this.total = have + spent;
    this.type = type;
  }
}

export interface MemberDataDTO {
  hotmNodes: HotmNodeRecord
  hotmLevel: number;
  powders: PowderData[]
  maxTokens: number
}

export class MemberData {
  player: Player;
  hotmNodes: HotmNodeRecord
  hotmLevel: number;
  powders: PowderData[] = [];
  maxTokens: number

  constructor(pl: Player, iMD: IMemberData) {
    this.hotmLevel = this.xpToHotmLevel(iMD.mining_core.experience);
    this.hotmNodes = iMD.mining_core.nodes;
    this.maxTokens = this.hotmLevelToMaxToken(this.hotmLevel, this.hotmNodes);
    this.player = pl;
    this.powders = this.parsePowderData(iMD);
  }

  private parsePowderData(data: IMemberData): PowderData[] {
    const powders: PowderData[] = [];
    const powderTypes: PowderType[] = ['mithril', 'gemstone', 'glacite'];

    for (const type of powderTypes) {
      const have = data.mining_core[`powder_${type}`] || 0;
      const spent = data.mining_core[`powder_spent_${type}`] || 0;
      powders.push(new PowderData(have, spent, type));
    }

    return powders;
  }

  private xpToHotmLevel(xp: number): number {
    const xpCumSum = [0, 3000, 9000, 25000, 60000, 100000, 150000, 210000, 290000, 400000] // Hotm XP Values
      .reduce((acc: number[], val) => {
        acc.push((acc[acc.length - 1] || 0) + val);
        return acc;
      }, []);
    let level = 0;
    while (xp > xpCumSum[level]) {
      level++;
    }
    return level
  }

  private hotmLevelToMaxToken(lvl: number, nodes: HotmNodeRecord): number {
    const tokens = [1, 3, 5, 7, 9, 11, 14, 16, 18, 20] // Cumulative token reward values
    const coreOTM = nodes['special_0'] || 0;

    // reduce ts pmo :rose:
    const cOTMTokens = [1, 5, 7, 10].reduce(
      (sum, l) => sum +
        (coreOTM >= l
          ? (l === 10 ? 2 : 1)
          : 0)
      , 0);
    return tokens[lvl] + cOTMTokens
  }

  asDTO(): MemberDataDTO {
    return {
      hotmNodes: this.hotmNodes,
      hotmLevel: this.hotmLevel,
      powders: this.powders,
      maxTokens: this.maxTokens
    }
  }

}

type PowderType = 'mithril' | 'gemstone' | 'glacite';
type HotmNodeRecord = Record<string, number>