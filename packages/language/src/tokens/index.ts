import { Tokenizer } from './Tokenizer'

export { Token } from './Token'
export { TokenType } from './TokenType'
export {
  additionTokens,
  assignmentOperatorTokens,
  blankTokens,
  blockStart,
  comparisonTokens,
  equalityTokens,
  indiceTokens,
  multiplicationTokens,
  newLineTokens,
  synchronizeTokens,
  unaryTokens,
  variableDeclarationTokens,
  getAssignmentOperator,
  getBinaryOperator,
  AssignmentOperator,
  BinaryOperator,
  LogicalOperator,
  UnaryOperator,
} from './tokenGroups'

export const getTokens = (code: string) => new Tokenizer(code).getTokens()
