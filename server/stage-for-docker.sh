#!/bin/sh

set -e

mkdir -p core/dist
cp -a ../core/dist/. core/dist/
cp ../core/package.json core/
