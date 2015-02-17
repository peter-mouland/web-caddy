# Releasing your Component

 > Only do this if you are ready for this to go public i.e. Is the repository address is never going to change

`component release`

   * This will push the demo site to github.io 
   * Tag the version number in Git (Bower will use this if configured))
   * It will also push the compiled assets to the S3 (if configured)
   * The version number is bumped ('patch' incremented). 
   * you can also use `component release --version=` along with `major`, `minor`, `patch` or `prerelease`

### Bower

To release to `bower` please update your `config/index.js` and run once :

 * `component new bower`
 
### Amazon Web Services (AWS)

To release to AWS please update your `component.config.js`.

# Moving your component to SkyGlobal

> After developing your component in your own repo, you may want to transfer ownership to skyglobal to open it up.

### Bower

First make sure that the component is not in the bower repo by running `bower search my-component`.
If the component exists, run

```
curl -X DELETE "https://bower.herokuapp.com/packages/PACKAGE?access_token=TOKEN"
```

### Update Documents

Make sure your github username is not in the documents. Run the following to help:

`gulp transfer:user --old-user=someone --new-user=someone-else`

### Transfer Github Ownership

...
