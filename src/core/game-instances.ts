import {ActressBehavior} from './actress';
import {DirectorBehavior} from './director';
import {Res, Result} from './utils/result';
import {BodyTypes, EventTypes, MindTypes, Setting} from './setting';
import {EventApplier} from './event';

export type GameInstances<Stg extends Setting> = {
  director: DirectorBehavior<Stg>;
  eventAppliers: {[EvType in EventTypes<Stg>]: EventApplier<Stg, EvType>};
  actresses: {[MT in MindTypes<Stg>]: ActressBehavior<Stg, BodyTypes<Stg>, MT>};
};

export class GameInstancesTrait {
  static getDirectorBehavior<Stg extends Setting>(
    instances: GameInstances<Stg>
  ): DirectorBehavior<Stg> {
    return instances.director;
  }

  static getActressBehavior<Stg extends Setting, MT extends MindTypes<Stg>>(
    mindType: MT,
    instances: GameInstances<Stg>
  ): Result<ActressBehavior<Stg, BodyTypes<Stg>, MT>> {
    const maybeAct = instances.actresses[mindType];
    if (maybeAct === undefined) {
      return Res.err(`Actress behavior for '${mindType}' is not exist`);
    }
    return Res.ok(instances.actresses[mindType]);
  }
}
