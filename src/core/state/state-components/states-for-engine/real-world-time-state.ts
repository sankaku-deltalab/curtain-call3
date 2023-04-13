export type RealWorldTimeState = Readonly<{
  realWorldTimeDeltaMs: number;
}>;

export class TRealWorldTimeState {
  static new(realWorldTimeDeltaMs = 0): RealWorldTimeState {
    return {realWorldTimeDeltaMs};
  }
}
