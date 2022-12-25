# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[unreleased]: https://github.com/sankaku-deltalab/curtain-call3/compare/1.0.0-alpha.6...HEAD
[1.0.0-alpha.6]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.6
[1.0.0-alpha.5]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.5
[1.0.0-alpha.4]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.4
[1.0.0-alpha.3]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.3
[1.0.0-alpha.2]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.2
[1.0.0-alpha.1]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.1
[1.0.0-alpha.0]: https://github.com/sankaku-deltalab/curtain-call3/releases/tag/1.0.0-alpha.0
