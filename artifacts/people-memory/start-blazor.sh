#!/bin/bash
PORT="${PORT:-24841}"
cd /home/runner/workspace/artifacts/people-memory/PeopleMemory
exec dotnet run --urls "http://0.0.0.0:${PORT}"
