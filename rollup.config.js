// import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: './src/main.ts',
  output: {
    file: './docs/mental-map.js', format: 'iife'
  },
  plugins: [nodeResolve(), typescript()]
}