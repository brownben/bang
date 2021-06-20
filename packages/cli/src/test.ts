import { BangError, execute } from '@bang!/language'
import type {
  Primitive,
  PrimitiveError,
  PrimitiveDictionary,
  PrimitiveNull,
} from '@bang!/language/dist/primitives'
import chalk from 'chalk'
import glob from 'glob'
import { createInterpreter, getErrorMessage, readFile } from './helpers'

type BangTestResults = Record<string, PrimitiveNull | PrimitiveError>
type TestResultsSummary = {
  filePath: string
  details: string
  errorDetails: string
  numberOfPassedTests: number
  numberOfFailedTests: number
  numberOfTests: number
  runningTime: number
  errored: boolean
}

const isError = (value: Primitive): value is PrimitiveError =>
  typeof value === 'object' && value.hasOwnProperty('error')

const outputPass = (filePath: string) =>
  console.log(chalk.bgGreenBright.bold(' PASS ') + ' ' + filePath)
const outputFail = (filePath: string) =>
  console.log(chalk.bgRed.whiteBright.bold(' FAIL ') + ' ' + filePath)
const getPassedFailedTotal = (passed: number, failed: number) => {
  let message = ''
  if (passed) message += chalk.green(passed + ' passed') + ', '
  if (failed) message += chalk.red(passed + ' failed') + ', '
  message += `${passed + failed} total`
  return message
}

const getSummaryOfTests = (
  filePath: string,
  testResults: BangTestResults,
  runningTime: number
): TestResultsSummary | undefined => {
  let details = ''
  let errorDetails = ''
  let numberOfTests = 0
  let numberOfPassedTests = 0

  for (const [description, result] of Object.entries(testResults)) {
    numberOfTests += 1
    if (isError(result)) {
      details += `  ${chalk.red('✖')} ${description} \n`
      details += `    ${getErrorMessage(result.error)} \n`
      errorDetails += `  ${chalk.red('✖')} ${description} \n`
      errorDetails += `    ${getErrorMessage(result.error)} \n`
    } else {
      numberOfPassedTests += 1
      details += `  ${chalk.green('✓')} ${description} \n`
    }
  }

  return {
    filePath,
    details,
    errorDetails,
    numberOfPassedTests,
    numberOfFailedTests: numberOfTests - numberOfPassedTests,
    numberOfTests,
    runningTime,
    errored: errorDetails === '',
  }
}

const runTestSuite = async (filePath: string) => {
  const fileContents = await readFile(filePath)
  if (!fileContents) return

  const interpreter = createInterpreter()
  const enviroment = interpreter.getEnviroment()

  try {
    const startTime = performance.now()
    await execute(fileContents, interpreter)
    const endTime = performance.now()

    const results = (
      enviroment.get('$_BANG_TEST_RESULTS_$') as PrimitiveDictionary
    ).dictionary as BangTestResults

    return getSummaryOfTests(filePath, results, endTime - startTime)
  } catch (error) {
    if (!(error instanceof BangError)) throw error

    console.log(getErrorMessage(error, fileContents))
    return
  }
}

export const runTests = async (
  pattern: string,
  { verbose }: { verbose: boolean }
) => {
  const matchingFiles = glob.sync(
    pattern ? `*${pattern}*/*.test.bang` : `**/*.test.bang`
  )
  const testResults = await Promise.all(
    matchingFiles.map((file) => runTestSuite(file))
  )

  let totalRunningTime = 0
  let passedTests = 0
  let failedTests = 0
  let passedSuites = 0
  let failedSuites = 0

  testResults.forEach((result, index) => {
    if (!result) {
      outputFail(matchingFiles[index])
      console.log('  Failed to Run Test Suite')
      return
    }

    totalRunningTime += result.runningTime
    passedTests += result.numberOfPassedTests
    failedTests += result.numberOfFailedTests

    if (result.errored) {
      outputFail(result.filePath)
      failedSuites += 1
    } else {
      outputPass(result.filePath)
      passedSuites += 1
    }

    if (verbose || matchingFiles.length === 1) console.log(result.details)
    else if (result.errored) console.log(result.errorDetails)
  })

  console.log(
    `${chalk.bold('Test Suites:')} ${getPassedFailedTotal(
      passedSuites,
      failedSuites
    )}`
  )
  console.log(
    `${chalk.bold('Tests:')}       ${getPassedFailedTotal(
      passedTests,
      failedTests
    )}`
  )
  console.log(
    `${chalk.bold('Time:')}        ${(totalRunningTime / 1000).toFixed(2)}s`
  )
}
