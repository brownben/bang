> **Note**
>
> I am no longer working on this version of Bang. I have been working on a bytecode interpreter written in Rust
> 
> Check it out: https://github.com/brownben/bang2

<img src="./Logo.svg" height="175px">

# Bang

Bang is my attempt at creating a programming language, based on the
parts I like of languages I have used. It is mostly inspired by
JavaScript and Python and is created using TypeScript.

Based on and inspired by the awesome [Crafting Interpreters](https://craftinginterpreters.com/) by Robert Nystrom.

## Usage

```
# format code with prettier
npm run format

# type-check code with typescript
npm run type-check

# link code with eslint
npm run lint

# build
npm run build

# open a simple REPL
node cli

# run a bang program
node cli run <file>

# to run vscode with the extension
code --extensionDevelopmentPath="<PATH-TO>/packages/vscode"
```

## Docs

Documentation and a guide to the language can be found [here.](./docs.md)

## License

[MIT](./LICENSE)
