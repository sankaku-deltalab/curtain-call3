# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Change whole architecture.

### Added

- Add `ImStruct`.
- Add `ImSet.size`.
- Add `ImMap.size`.
- Add `ImSetTrait.keys`.
- Add `Setting.dataSources` and `DataSourcesHelper`.
- Add `Setting.dynamicSources` and `DynamicSourceHelper`.

## [1.0.0-alpha.16] - 2023-01-01

### Added

- Add type `AnyActressInitializer`.
- Add type `AnyMindActressInitializer`.

### Changed

- `BodyState` contain self id in meta.
- `MindState` contain self id in meta.
- `GameStateHelper.addActress` return body and mind too.
- `BodyState` contain time.

### Fixed

- Fix `ImList.new`.
- Fix `ImList.concat`.

## [1.0.0-alpha.15] - 2022-12-25

### Fixed

- Fix actress deleting.

## [1.0.0-alpha.14] - 2022-12-25

### Added

- Add `ActressHelper.addCue`.
- Add `ActressHelper.addNotification`.
- Add `GameStateHelper.addBodies`.

### Changed

- Use `ImList` at cues and notifications.

## [1.0.0-alpha.13] - 2022-12-25

### Fixed

- Fix `GameProcessingHelper.generateGraphics`.

## [1.0.0-alpha.11] - 2022-12-25

### Fixed

- Internally, fix some codes with wrong `Array.concat`.

## [1.0.0-alpha.10] - 2022-12-25

### Changed

- Internal changes for faster processing.

## [1.0.0-alpha.9] - 2022-12-25

### Changed

- Internal changes for faster processing.

## [1.0.0-alpha.8] - 2022-12-25

### Changed

- Change some function arguments and return for faster processing.

## [1.0.0-alpha.7] - 2022-12-25

### Changed

- Faster update.

## [1.0.0-alpha.6] - 2022-12-25

### Fixed

- Fix importing.

## [1.0.0-alpha.5] - 2022-12-25

### Added

- Add `ImMap` and `ImSet`.

### Changed

- `ActressParts` use `ImMap`.

## [1.0.0-alpha.4] - 2022-12-21

### Added

- Add `GameProcessingHelper`.

### Changed

- Change `Setting`.
- Add `ActressBehavior.createProps` and `ActressBehavior` uses props.

## [1.0.0-alpha.3] - 2022-12-20

### Fixed

- Delete `Setting.representation`.
- Fix `GameRepresentation.getRenderingArea`.

## [1.0.0-alpha.2] - 2022-12-18

### Added

- Add `DirectorBehavior.applyInput`.

### Changed

- Now GameState contains CollisionState.
- RecSet and RecM2M become generic.
- Rename event to cue because name `Event` of curtain-call conflict `Event` of browser js.
- Rename `CueManipulator` (`EventManipulator`) to `CueHandler`.
- Remove overlaps from arguments without GameState.
- Rename `Im.replace` to `Im.update`.

### Removed

- Delete VisibleGameState because it's useless.

## [1.0.0-alpha.1] - 2022-12-11

### Added

- Events from external at update.

## [1.0.0-alpha.0] - 2022-12-07

### Added

- Initial beta release.

[unreleased]: https://github.com/sankaku-deltalab/curtain-call3/compare/1.0.0-alpha.17...HEAD
[1.0.0-alpha.17]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.17
[1.0.0-alpha.16]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.16
[1.0.0-alpha.15]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.15
[1.0.0-alpha.14]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.14
[1.0.0-alpha.13]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.13
[1.0.0-alpha.12]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.12
[1.0.0-alpha.11]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.11
[1.0.0-alpha.10]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.10
[1.0.0-alpha.9]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.9
[1.0.0-alpha.8]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.8
[1.0.0-alpha.7]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.7
[1.0.0-alpha.6]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.6
[1.0.0-alpha.5]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.5
[1.0.0-alpha.4]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.4
[1.0.0-alpha.3]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.3
[1.0.0-alpha.2]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.2
[1.0.0-alpha.1]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.1
[1.0.0-alpha.0]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.0
