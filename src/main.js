import esbuild from 'esbuild'
import fs from 'fs'

const outDir = 'dist';

(async () => {
    console.log("开始打包!!!\n");

    const dPath = `${outDir}/download.js`
    const UnzipDPath = `${outDir}/download.console.js`

    await esbuild.build({
        entryPoints: ['./src/download.js'],
        format: 'iife',
        minify: true,
        bundle: true,
        outfile: dPath,
    });

    const data = fs.readFileSync(dPath, { encoding: "utf-8" })
    console.log(`压缩代码:${data}`);

    fs.writeFileSync(dPath, `javascript:${data.replaceAll("\n", "")}void(0);`)

    await esbuild.build({
        entryPoints: ['./src/download.js'],
        format: 'iife',
        minify: false,
        bundle: true,
        outfile: UnzipDPath,
    })

    console.log("打包完成!!!");
})()