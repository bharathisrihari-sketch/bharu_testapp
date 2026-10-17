import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { AndroidFile } from '../types/android';

export async function exportProjectAsZip(files: AndroidFile[], projectName = 'SimpleTestApp') {
  const zip = new JSZip();

  // Root project files
  zip.file('build.gradle', `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'com.android.application' version '8.2.2' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.22' apply false
}`);

  zip.file('settings.gradle', `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${projectName}"
include ':app'`);

  zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRclass=true`);

  // Add all files from editor
  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  // Generate ZIP blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}.zip`);
}
