# Releasing your Component

`gulp release`

   * This will push the demo site to github.io 
   * Tag the version number in Git (Bower will use this if configured))
   * It will also push the compiled assets to the S3 (if configured)
   * The version number is bumped ('patch' incremented). 
   * you can also use `gulp release --version ` along with `major`, `minor`, `patch` or `prerelease`

### Bower

To release to `bower` please update your `config/index.js` and run once :

 * `gulp init:bower`
 
### Amazon Web Services (AWS)

To release to AWS please update your `config/index.js`.