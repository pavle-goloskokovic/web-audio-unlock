import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: ['src/index.ts'],
        format: ['cjs', 'esm'],
        target: 'es5',
        dts: true,
        minify: false,
        clean: true,
        outExtension({ format })
        {
            return {
                js: format === 'esm' ? '.mjs' : '.js',
            };
        },
    },
    {
        entry: ['src/index.ts'],
        format: ['cjs', 'esm'],
        target: 'es5',
        dts: false,
        minify: true,
        clean: false,
        outExtension({ format })
        {
            return {
                js: format === 'esm' ? '.min.mjs' : '.min.js',
            };
        },
    },
]);
