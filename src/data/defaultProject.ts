import { AndroidFile } from '../types/android';

export const INITIAL_FILES: AndroidFile[] = [
  {
    id: 'main-activity',
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/example/simpletestapp/MainActivity.kt',
    language: 'kotlin',
    iconName: 'FileCode',
    content: `package com.example.simpletestapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.simpletestapp.databinding.ActivityMainBinding
import com.google.ai.client.generativeai.GenerativeModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    // TODO: Replace with your Gemini API Key from Google AI Studio
    private val apiKey = "YOUR_GEMINI_API_KEY"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val model = GenerativeModel(
            modelName = "gemini-3.8-flash",
            apiKey = apiKey
        )

        binding.btnSend.setOnClickListener {
            val prompt = binding.inputPrompt.text.toString()

            if (prompt.isBlank()) {
                binding.textResponse.text = "Please enter a prompt first."
                return@setOnClickListener
            }

            binding.textResponse.text = "Gemini is thinking..."

            CoroutineScope(Dispatchers.Main).launch {
                try {
                    val response = model.generateContent(prompt)
                    binding.textResponse.text = response.text
                } catch (e: Exception) {
                    binding.textResponse.text = "Error: \${e.localizedMessage}"
                }
            }
        }
    }
}`
  },
  {
    id: 'activity-main-xml',
    name: 'activity_main.xml',
    path: 'app/src/main/res/layout/activity_main.xml',
    language: 'xml',
    iconName: 'Layout',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="24dp"
    android:background="#FFFFFF">

    <TextView
        android:id="@+id/textTitle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, Bharathi Purushothaman"
        android:textSize="22sp"
        android:textStyle="bold"
        android:textColor="#1F2937" />

    <TextView
        android:id="@+id/textEmail"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Email: bharathi.srihari@gmail.com"
        android:textSize="18sp"
        android:paddingTop="4dp"
        android:textColor="#4B5563" />

    <EditText
        android:id="@+id/inputPrompt"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Ask Gemini something..."
        android:padding="12dp"
        android:layout_marginTop="20dp"
        android:background="@drawable/edit_text_border"
        android:textSize="16sp" />

    <Button
        android:id="@+id/btnSend"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Send to Gemini"
        android:layout_marginTop="16dp"
        android:backgroundTint="#2563EB"
        android:textColor="#FFFFFF" />

    <TextView
        android:id="@+id/textResponse"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textSize="18sp"
        android:paddingTop="20dp"
        android:textColor="#1F2937" />

</LinearLayout>`
  },
  {
    id: 'build-gradle-app',
    name: 'build.gradle (Module: app)',
    path: 'app/build.gradle',
    language: 'groovy',
    iconName: 'FileText',
    content: `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.example.simpletestapp'
    compileSdk 34

    defaultConfig {
        applicationId "com.example.simpletestapp"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    buildFeatures {
        viewBinding true
    }
}

dependencies {
    implementation("com.google.ai.client:generativeai:0.7.0")
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    testImplementation("junit:junit:4.13.2")
}`
  },
  {
    id: 'android-manifest',
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    iconName: 'FileCode',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/full_backup_content"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SimpleTestApp"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  },
  {
    id: 'strings-xml',
    name: 'strings.xml',
    path: 'app/src/main/res/values/strings.xml',
    language: 'xml',
    iconName: 'FileText',
    content: `<resources>
    <string name="app_name">SimpleTestApp</string>
    <string name="user_name">Hello, Bharathi Purushothaman</string>
    <string name="user_email">Email: bharathi.srihari@gmail.com</string>
    <string name="prompt_hint">Ask Gemini something...</string>
    <string name="btn_send">Send to Gemini</string>
</resources>`
  },
  {
    id: 'readme-md',
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    iconName: 'BookOpen',
    content: `# Android Studio + Gemini Starter App

### Setup & Integration Steps

1. **Add Gemini SDK to \`build.gradle\` (Module: app)**
   \`\`\`groovy
   dependencies {
       implementation("com.google.ai.client:generativeai:0.7.0")
   }
   \`\`\`

2. **Add Internet Permission in \`AndroidManifest.xml\`**
   \`\`\`xml
   <uses-permission android:name="android.permission.INTERNET" />
   \`\`\`

3. **Enable ViewBinding in \`build.gradle\`**
   \`\`\`groovy
   android {
       buildFeatures {
           viewBinding true
       }
   }
   \`\`\`

4. **Testing in Google AI Studio**
   - Go to Google AI Studio
   - Create an API key
   - Paste into \`MainActivity.kt\` or configure environment variables
   - Run in emulator / connected device
   - Submit prompt → Receive response instantly

5. **Deploying to Play Store**
   - Select \`Build\` → \`Generate Signed Bundle / APK\`
   - Choose \`Android App Bundle (.aab)\`
   - Upload \`.aab\` to Google Play Console
   - Fill store listing details & Publish!
`
  }
];
