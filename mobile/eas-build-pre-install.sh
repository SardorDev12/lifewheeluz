#!/usr/bin/env bash
echo "=== JVM diagnostics ==="
echo "--- /usr/lib/jvm ---"
ls -la /usr/lib/jvm/ 2>&1
echo "--- current java ---"
which java 2>&1
java -version 2>&1
echo "--- update-alternatives ---"
update-alternatives --list java 2>&1
echo "--- JAVA_HOME env vars ---"
env | grep -i java 2>&1
echo "=== end JVM diagnostics ==="
