import {z} from 'zod';

export class Profile {
  profileId: string;
  fruitName: string;
  gameMode: GameMode
  active: boolean

  constructor(profileId: string, fruitName: string, gameMode: GameMode, active: boolean) {
    this.profileId = profileId
    this.fruitName = fruitName
    this.gameMode = gameMode
    this.active = active
  }

  public asDTO(): ProfileDTO {
    return {
      profileId: this.profileId,
      profileFruit: this.fruitName as unknown as typeof SkyblockProfileNames,
      gameMode: this.gameMode,
      active: this.active
    }
  }
}

export interface ProfileDTO {
  profileId: string,
  profileFruit: typeof SkyblockProfileNames,
  gameMode: GameMode
  active: boolean
}

// https://github.com/Hypixel-API-Reborn/hypixel-api-reborn/blob/9f4528aa17a0d23fe7935586c974df8ed50be3b1/src/Types/SkyBlock.ts#L75
// converted to a string union type
const SkyblockProfileNames = [
  'Apple', 'Banana', 'Blueberry', 'Coconut', 'Cucumber', 'Grapes',
  'Kiwi', 'Lemon', 'Lime', 'Mango', 'Orange', 'Papaya', 'Pear',
  'Peach', 'Pineapple', 'Pomegranate', 'Raspberry', 'Strawberry',
  'Tomato', 'Watermelon', 'Zucchini',
  'Not Allowed To Quit SkyBlock Ever Again',
  'Complain Everyday',
  'Restored',
  'TEST',
] as const

const ProfileResponseSchema = z.object({
  profile_id: z.string().uuid(),
  cute_name: z.enum(SkyblockProfileNames),
  game_mode: z.enum(['ironman', 'bingo', 'stranded']).optional(),
  selected: z.boolean(),
})

export const ProfileArraySchema = z.array(ProfileResponseSchema)

export type GameMode = 'normal' | 'ironman' | 'bingo' | 'stranded'