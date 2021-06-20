#!/usr/bin/env node

import cac from 'cac'
import { createREPL } from './repl'
import { displayTokens } from './tokens'
import { executeFile } from './run'
import { runTests } from './test'

const version = '0.3.0'

const cli = cac('bang').version(`v${version}`).help()

cli.command('', 'Open a REPL').action(createREPL(version))
cli.command('run <file>', 'Execute a Bang Program').action(executeFile)
cli
  .command('test <pattern>', 'Run Tests')
  .option('-v, --verbose', 'Print All Test Details')
  .action(runTests)
cli.command('tokens <file>', 'Get Tokens for a File').action(displayTokens)

cli.parse()
