# GitHub Pages deployment

Deployment target: https://claretgrace0801.github.io/Fragments/

This repository contains a Unity project, not a browser-ready export. The
`Build and deploy Fragments` GitHub Actions workflow builds the actual game on
GitHub's runner and publishes only the successful WebGL export. Unity does not
need to be installed on the developer's computer to run this workflow.

## One-time cloud build activation

Unity requires an activated license for unattended builds. In
[repository Actions secrets](https://github.com/claretgrace0801/Fragments/settings/secrets/actions),
configure `UNITY_EMAIL` and `UNITY_PASSWORD`, plus either `UNITY_LICENSE` for a
Personal license or `UNITY_SERIAL` for a Pro license. Use GitHub's secret inputs;
never commit credentials or license files. Follow the current
[GameCI activation instructions](https://game.ci/docs/github/activation/).

In [Pages settings](https://github.com/claretgrace0801/Fragments/settings/pages),
the publishing source must be **GitHub Actions**. Then run
[Build and deploy Fragments](https://github.com/claretgrace0801/Fragments/actions/workflows/pages.yml)
with **Run workflow**, or push a game change to `main`.

The initial build takes longer because Unity imports the project. Later builds
reuse the `Library` cache. The public game is available only after both the
build and deployment jobs succeed.

## Build configuration

The original project omitted `ProjectSettings/ProjectVersion.txt`. The cloud
build now selects Unity **2021.3.45f1**, a 2021 LTS editor compatible with the
project's 2D Animation 7 and PSD Importer 6 package generation. This selected
editor version still needs validation by the first licensed build.

`Assets/Editor/WebGLBuild.cs` exports all six enabled scenes, starting with the
menu, into `build/WebGL`. It disables WebGL file compression and threads so the
game can be served by GitHub Pages without custom encoding or cross-origin
isolation headers. All generated URLs use Unity's standard relative paths, so
the export can run below `/Fragments/`. StreamingAssets include both cutscenes.

The old build callback forced Python to a developer-specific macOS path. It has
been removed so the cloud runner uses Unity's bundled WebGL toolchain.

## Existing export alternative

A complete existing WebGL export can also be hosted without rebuilding Unity.
It must include `index.html`, the entire `Build` folder, `TemplateData` if
referenced, and `StreamingAssets`. A source checkout or a desktop executable
cannot substitute for a WebGL export. Compressed exports need Unity's
decompression fallback enabled because GitHub Pages cannot set the required
Unity Content-Encoding headers.

## Verification after publishing

Open the Pages URL in a desktop browser and confirm the menu loads, start the
game, play through the introductory cutscene into Level 1, and check input,
audio, and fullscreen. Check the browser console and network panel for missing
files and runtime errors. Cloud compilation and runtime verification remain
pending until Unity activation or an existing WebGL export is available.
