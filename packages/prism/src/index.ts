import Prism from 'prismjs'

export const addBang = (prism: typeof Prism) => {
  prism.languages.bang = prism.languages.extend('javascript', {
    keyword: [
      {
        pattern: /\b(?:if|else|while|let|const|return|import|as|from|try)\b/,
        lookbehind: true,
      },
    ],
    operator: [
      {
        pattern:
          /!|\*|-|\+|\/|~|==|=|!=|!==|<=|>=|<|>|&&|\|\||\\*=|\/=|%=|\+=|-=|=>|\.\.\.|\bor\b|\band\b|%|\?\?|\?\.|\./,
      },
    ],
    boolean: [{ pattern: /\b(?:true|false|null)\b/ }],
  })
}
