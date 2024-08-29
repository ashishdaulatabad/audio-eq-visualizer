#!/usr/bin/env node

import esbuild from "esbuild";

async function build() {
    await esbuild.build({
        logLevel: "info",
        entryPoints: ["./src/index.ts", './src/scripts/phase-vocoder.service.js'],
        bundle: true,
        outdir: './dist',
        minify: true
    });
}

console.log(process.cwd())
build()
