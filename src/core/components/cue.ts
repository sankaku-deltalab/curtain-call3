import {CuePayload, CueTypes, Setting} from '../setting';
import {Im} from '../../utils/immutable-manipulation';
import {ImList, ImListTrait} from '../../utils/collections/im-list';

export type CueState<Stg extends Setting> = Readonly<{
  cues: Partial<OrganizedCues<Stg>>;
}>;

export type Cue<Stg extends Setting, Type extends CueTypes<Stg>> = Readonly<{
  type: Type;
  payload: CuePayload<Stg, Type>;
}>;

export type AnyCue<Stg extends Setting> = Cue<Stg, CueTypes<Stg>>;

type OrganizedCues<Stg extends Setting> = Readonly<{
  [CueType in CueTypes<Stg>]: ImList<Cue<Stg, CueType>>;
}>;

export type CuePriority<Stg extends Setting> = {
  earlier: CueTypes<Stg>[];
  later: CueTypes<Stg>[];
};

export class CueTrait {
  static initialState<Stg extends Setting>(): CueState<Stg> {
    return {
      cues: {},
    };
  }

  static mergeCues<Stg extends Setting>(
    cueSt: CueState<Stg>,
    cues: ImList<AnyCue<Stg>>
  ): CueState<Stg> {
    if (cues.size === 0) return cueSt;

    const orgCuesMut = {...cueSt.cues};
    for (const c of ImListTrait.toArray(cues)) {
      const list = orgCuesMut[c.type] ?? ImListTrait.new();
      orgCuesMut[c.type] = ImListTrait.push(list, c);
    }
    return Im.update(cueSt, 'cues', () => orgCuesMut);
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
    const cueTypesInPriorityOrder = this.sortCueTypesByPriority(
      Object.keys(state.cues),
      args
    );
    for (const cueType of cueTypesInPriorityOrder) {
      const cues = state.cues[cueType];

      if (cues === undefined) continue;
      if (cues.size === 0) continue;

      const [poped, newCuesList] = ImListTrait.pop(cues, undefined);

      const newState = Im.update(state, 'cues', cuesObj => {
        return Im.update(cuesObj, cueType, () => newCuesList);
      });
      return {
        state: newState,
        cue: poped,
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
}
