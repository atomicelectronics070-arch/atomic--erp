@echo off
title ATOMIC ERP APK BUILDER
echo Starting APK compilation...

set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Checking Java JDK...
if not exist "%JAVA_HOME%\bin\javac.exe" (
    echo ERROR: JDK not found at "%JAVA_HOME%"
    echo Please make sure Android Studio is installed.
    exit /b 1
)

echo Java JDK OK: "%JAVA_HOME%"
echo Building Android project using Gradlew...

cd android
call .\gradlew.bat assembleDebug --no-daemon --console=plain

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Gradle build failed.
    exit /b 1
)

echo Copying APK file...
set "OUTPUT_APK=app\build\outputs\apk\debug\app-debug.apk"
set "DEST_DOWNLOADS=C:\Users\SANTIAGO\Downloads\atomic_erp.apk"
set "DEST_BRAIN=C:\Users\SANTIAGO\.gemini\antigravity\brain\77fc2104-3877-4fa1-8aba-c0f973653e6e\atomic_erp.apk"

if exist "%OUTPUT_APK%" (
    copy /y "%OUTPUT_APK%" "%DEST_DOWNLOADS%"
    copy /y "%OUTPUT_APK%" "%DEST_BRAIN%"
    echo SUCCESS: APK copied to Downloads and Brain folder.
) else (
    echo ERROR: Compiled APK file not found at "%OUTPUT_APK%".
    exit /b 1
)

echo Done compiling.
