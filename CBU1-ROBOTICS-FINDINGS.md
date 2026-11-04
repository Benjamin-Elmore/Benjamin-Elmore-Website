# CBU1 robotics portfolio findings

Research prepared November 3, 2026 from the project notes and their linked public GitHub histories. This expands the non-ARC robotics evidence already summarized in `PORTFOLIO-CONTENT.md`.

## 2025 VEX/PROS navigation work

The [HamburgerTesting repository](https://github.com/CBU-Robotics/HamburgerTesting) records 14 reachable commits attributed to Benjamin between September 16 and October 28, 2025. This work offers a specific progression from manual robot control toward autonomous motion logic.

- Added a driver-controls module in [commit `059ee3e`](https://github.com/CBU-Robotics/HamburgerTesting/commit/059ee3e53e408f3ea846c255f09f27251e8a5efb).
- Explored Pure Pursuit and spline-search code. The project record marks spline and odometry portions as unfinished, so present this as exploration rather than a completed path-following capability.
- Added baseline point-navigation source in [commit `2431057`](https://github.com/CBU-Robotics/HamburgerTesting/commit/2431057fbad27166b85cf01baa1ac1f67cf705ba). Later changes refined target-angle units and fixed a second-spline bug in [commit `a84d605`](https://github.com/CBU-Robotics/HamburgerTesting/commit/a84d605948848d526c28d8e59996d6ee88eb180f).
- At the final authored point-navigation revision, source reads odometry, rotates target error into the robot frame, computes proportional x/y/heading commands, and maps them to left, right, and strafe motors.

**Evidence limit:** the history documents source changes, not a robot run or measured navigation performance. Avoid describing this as validated autonomous navigation.

## Earlier drivetrain control

The [RobotBenjaminLucas repository](https://github.com/SdBenE/RobotBenjaminLucas) records two reachable commits by Benjamin. [Commit `04fdac4`](https://github.com/SdBenE/RobotBenjaminLucas/commit/04fdac439095885fe6ae23640b72cc052737c511) added joystick-driven drivetrain control, centralized controller and motor-group configuration, and delegated the PROS `opcontrol` loop from `main.cpp`. It sets up left and right motor groups.

**Evidence limit:** this is implementation history without a recorded test or hardware run. The earlier PROS scaffold commit is setup evidence and should not imply authorship of the imported SDK.

## Portfolio use

These examples can support a concise progression alongside ARC: robot-level control and navigation logic came first, followed by embedded firmware and external sensor/controller interfaces. For defense and space manufacturing audiences, the grounded connection is practice with coordinate transforms, motor-control structure, interface boundaries, and incremental implementation. Frame these as transferable experience and interest, not production or flight heritage.

## Source notes

- Vault project notes: `Obsidian Vault/Projects/Robotics/HamburgerTesting — 2025 VEX Navigation.md` and `Obsidian Vault/Projects/Robotics/RobotBenjaminLucas — 2025 Drivetrain Control.md`.
- Existing portfolio handoff: `Benjamin-Elmore-Website/PORTFOLIO-CONTENT.md`.
