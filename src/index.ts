import { getAbstractSyntaxTree } from './Parser'
import { interpret } from './Interpreter'
import { program } from 'commander'
import chalk from 'chalk'
const fs = require('fs').promises

program
  .name('bang')
  .version(require('../package.json').version)
  .arguments('<file>')
  .parse(process.argv)

const file = program.args[0]

fs.readFile(file, { encoding: 'utf8' })
  .then((fileContents: string) => {
    const abstractSyntaxTree = getAbstractSyntaxTree(fileContents)

    interpret(abstractSyntaxTree)
  })
  .catch(() => {
    console.log(chalk.red.bold('Error: Problem Reading File'))
  })
