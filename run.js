#!/usr/bin/env node

import esbuild from "esbuild";

async function build() {
    let context = await esbuild.context({
        logLevel: "info",
        entryPoints: ["./src/index.ts", './src/scripts/phase-vocoder.service.js'],
        bundle: true,
        outdir: './dist',
        minify: true
    });
    
    await context.serve({ servedir: './dist' })
}

console.log(process.cwd())
build()
