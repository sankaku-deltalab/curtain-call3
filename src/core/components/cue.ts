import {CuePayload, CueTypes, Setting} from '../setting';
import {Im} from '../../utils/immutable-manipulation';

export type CueState<Stg extends Setting> = Readonly<{
  cues?: OrganizedCues<Stg>;
}>;

export type Cue<Stg extends Setting, Type extends CueTypes<Stg>> = Readonly<{
  type: Type;
  payload: CuePayload<Stg, Type>;
}>;

export type AnyCue<Stg extends Setting> = Cue<Stg, CueTypes<Stg>>;

type OrganizedCues<Stg extends Setting> = Readonly<{
  [CueType in CueTypes<Stg>]: Cue<Stg, CueType>[];
}>;

export type CuePriority<Stg extends Setting> = {
  earlier: CueTypes<Stg>[];
  later: CueTypes<Stg>[];
};

export class CueTrait {
  static initialState<Stg extends Setting>(): CueState<Stg> {
    return {
      cues: undefined,
    };
  }

  static mergeCues<Stg extends Setting>(
    cueSt: CueState<Stg>,
    cues: AnyCue<Stg>[]
  ): CueState<Stg> {
    if (cues.length === 0) return cueSt;

    const types1: CueTypes<Stg>[] = cueSt.cues ? Object.keys(cueSt.cues) : [];
    const types2: CueTypes<Stg>[] = cues.map(e => e.type);
    const types: CueTypes<Stg>[] = [...new Set([...types1, ...types2])];

    const newCue = Im.pipe(
      () => cues,
      cue => CueTrait.organizeCues(cue, types)
    )();
    return Im.replace(cueSt, 'cues', oldCue => {
      if (oldCue === undefined) return newCue;
      return CueTrait.mergeOrganizedCues(oldCue, newCue, types);
    });
  }

  static createCue<Stg extends Setting, Type extends CueTypes<Stg>>(
    type: Type,
    payload: CuePayload<Stg, Type>
  ): Cue<Stg, Type> {
    return {
      type,
      payload,
    };
  }

  static popCue<Stg extends Setting>(
    state: CueState<Stg>,
    args: {priority: CuePriority<Stg>}
  ): {state: CueState<Stg>; cue?: AnyCue<Stg>} {
    if (state.cues === undefined) return {state};

    const cueTypesInPriorityOrder = this.sortCueTypesByPriority(
      Object.keys(state.cues),
      args
    );
    for (const cueType of cueTypesInPriorityOrder) {
      const cues = state.cues[cueType];

      if (cues === undefined) continue;
      if (cues.length === 0) continue;

      const cue = cues[cues.length - 1];
      const st = Im.replace(state, 'cues', cuesObj => {
        if (cuesObj === undefined) throw new Error('code bug');
        return Im.replace(cuesObj, cueType, cuesArray => {
          const cueArrayClone = [...cuesArray];
          cueArrayClone.pop();
          return cueArrayClone;
        });
      });
      return {
        state: st,
        cue: cue,
      };
    }

    return {state};
  }

  static sortCueTypesByPriority<Stg extends Setting>(
    types: CueTypes<Stg>[],
    args: {priority: CuePriority<Stg>}
  ): CueTypes<Stg>[] {
    const availableTypes = new Set(types);
    const notDontcareTypes = new Set([
      ...args.priority.earlier,
      ...args.priority.later,
    ]);
    const earlys = args.priority.earlier.filter(cueType =>
      availableTypes.has(cueType)
    );
    const laters = args.priority.later.filter(cueType =>
      availableTypes.has(cueType)
    );
    const dontcares = types
      .sort((a, b) => a.localeCompare(b))
      .filter(cueType => !notDontcareTypes.has(cueType));
    return [...earlys, ...dontcares, ...laters];
  }

  private static organizeCues<Stg extends Setting>(
    cues: AnyCue<Stg>[],
    types: CueTypes<Stg>[]
  ): OrganizedCues<Stg> {
    const mutCues: OrganizedCues<Stg> = Im.pipe(
      () => types,
      types => types.map<[CueTypes<Stg>, []]>(t => [t, []]),
      cue => Object.fromEntries<[]>(cue) as unknown as OrganizedCues<Stg>
    )();

    for (const cue of cues) {
      mutCues[cue.type].push(cue);
    }
    return mutCues;
  }

  private static mergeOrganizedCues<Stg extends Setting>(
    original: OrganizedCues<Stg>,
    other: OrganizedCues<Stg>,
    types: CueTypes<Stg>[]
  ): OrganizedCues<Stg> {
    return Im.pipe(
      () => types,
      types =>
        types.map<[CueTypes<Stg>, AnyCue<Stg>[]]>(t => [
          t,
          [...(original[t] ?? []), ...(other[t] ?? [])],
        ]),
      cue => Object.fromEntries(cue) as OrganizedCues<Stg>
    )();
  }
}
