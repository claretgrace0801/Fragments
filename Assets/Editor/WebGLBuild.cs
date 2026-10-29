using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

public static class WebGLBuild
{
    [MenuItem("Build/Fragments for GitHub Pages")]
    public static void Build()
    {
        const string output = "build/WebGL";
        var scenes = EditorBuildSettings.scenes
            .Where(scene => scene.enabled)
            .Select(scene => scene.path)
            .ToArray();

        if (scenes.Length == 0 || scenes.Any(scene => !File.Exists(scene)))
            throw new BuildFailedException("The enabled game scenes are missing.");

        // GitHub Pages cannot configure Unity-specific Content-Encoding headers.
        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
        PlayerSettings.WebGL.threadsSupport = false;
        PlayerSettings.WebGL.template = "APPLICATION:Default";
        PlayerSettings.defaultWebScreenWidth = 1280;
        PlayerSettings.defaultWebScreenHeight = 720;

        Directory.CreateDirectory(output);
        var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = output,
            target = BuildTarget.WebGL,
            options = BuildOptions.None
        });

        if (report.summary.result != BuildResult.Succeeded)
            throw new BuildFailedException("WebGL build failed: " + report.summary.result);

        File.WriteAllText(Path.Combine(output, ".nojekyll"), "");
        Debug.Log("GitHub Pages build is ready in " + output);
    }
}
