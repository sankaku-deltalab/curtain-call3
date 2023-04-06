import {DefineNotificationPayload} from '../../helper/game-dev';

export type EndGameNotification = DefineNotificationPayload<{
  finalScore: number;
}>;
