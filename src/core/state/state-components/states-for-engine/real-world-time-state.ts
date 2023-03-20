export type RealWorldTimeState = Readonly<{
  realWorldTimeDeltaMs: number;
}>;

export class TRealWorldTimeState {
  static new(): RealWorldTimeState {
    return {realWorldTimeDeltaMs: 0};
  }
}
