declare module 'emmet' {
  interface ExpandOptions {
    type?: 'markup' | 'stylesheet';
    syntax?: string;
  }

  function expand(abbreviation: string, options?: ExpandOptions): string;
  export default expand;
}
