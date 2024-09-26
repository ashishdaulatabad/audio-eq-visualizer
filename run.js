#!/usr/bin/env node

import esbuild from "esbuild";

async function watch() {
    let context = await esbuild.context({
        logLevel: "info",
        entryPoints: ["./src/index.ts", './src/scripts/phase-vocoder.service.js'],
        bundle: true,
        outdir: './dev',
    });
    await context.watch().then(async _ => {
        await context.serve({ port: 4200, servedir: './dev' }).then(data => {
            console.log(data);
        });
    });
    console.log('Watching over the process yall...');
}

console.log(process.cwd())
watch()
