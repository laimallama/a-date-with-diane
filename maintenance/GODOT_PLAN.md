# Godot direction

Recorded 13 September 2026. This document describes a future project; the existing HTML games retain Back.

## Confirmed decisions

- Engine: Godot, as requested by the project owner.
- Local installation: `/Applications/Godot.app`, executable version `4.7.2.stable.official.ed1daf0bf`, verified on 13 September 2026.
- Manual saves are available at choice points.
- Automatic checkpoints are created at scene boundaries.
- Dialogue history is readable but does not change game state.
- There is no gameplay rewind or step-by-step Back in the Godot version.

## Proposed implementation principles

Store versioned narrative data: current scene and choice point, variables, route flags, and any counters required for deterministic continuation. Keep settings separate from game progression. Load into a stable scene/choice state rather than attempting to resume arbitrary animation frames. Rebuild the scene from the saved state without repeating choice effects.

Create checkpoints only after a scene transition has successfully established its stable state. Preserve manual slots separately from automatic checkpoints. The number of slots, checkpoint retention, and menu design remain to be decided.

Godot supports persistent application data under `user://`. Its official [saving-games guide](https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html) describes serialization with `FileAccess`; the final save format and migration policy should be tested against the selected Godot version.

The first proposed prototype is a non-explicit conversation in one 3D set with a rigged adult character, ordinary gestures, choice UI, and save/load. This should prove scene reconstruction and the visual direction before broader production. No Godot project has been created by this maintenance pass.
