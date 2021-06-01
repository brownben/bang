export const addBang = (Prism) => {
  Prism.languages.bang = Prism.languages.extend('javascript', {
    keyword: [
      {
        pattern: /\b(?:if|else|while|let|const|return|import|as|from)\b/,
        lookbehind: true,
      },
    ],
    operator: [
      {
        pattern:
          /!|\*|\-|\+|\/|~|==|=|!=|!==|<=|>=|<|>|&&|\|\||\\*=|\/=|%=|\+=|\-=|=>|\.\.\.|\bor\b|\band\b/,
      },
    ],
    boolean: [{ pattern: /\b(?:true|false|null)\b/ }],
  })
}
