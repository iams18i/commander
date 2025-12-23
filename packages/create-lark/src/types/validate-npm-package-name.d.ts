declare module 'validate-npm-package-name' {
  export interface ValidationResult {
    validForNewPackages: boolean
    validForOldPackages: boolean
    errors?: string[]
    warnings?: string[]
  }

  function validate(name: string): ValidationResult
  export default validate
}

