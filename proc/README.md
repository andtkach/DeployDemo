# Proc App

Cron-style Node.js job for the DeployDemo proc service. The app waits a random
0-1000 ms, logs the timestamp, hostname, and version, waits another random
0-1000 ms, then exits.

## Build the image

From the `proc` folder:

```
./build-proc.ps1
```

This builds the multistage image and tags it as:

```
depdemo-proc:v1
depdemo-proc:latest
```

## Run locally

From the `proc` folder:

```
./run-proc.ps1
```

You should see a single log line similar to:

```
datetime=2026-05-05T07:05:52.192Z server=hostname version=v1
```
