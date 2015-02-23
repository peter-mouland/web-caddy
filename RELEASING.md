# Releasing your Component

 > Only do this if you are ready for this to go public i.e. the repository address is never going to change

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

The recommended (and default) way to deal with AWS credentials is to
use the standard file `~/.aws/credentials` with a dedicated section
named after your component. This is achieved by the option `profile:
pkg.name` in the release section of your `component.config.js`.

If you don't have a `profile` setting in your `component.config.js`,
then the default behaviour of the AWS SDK applies. This lets you use
your default profile in `~/aws/credentials` or the standards
environment variables **AWS_ACCESS_KEY_ID** and
**AWS_SECRET_ACCESS_KEY** which take precedence over the file. For
more information see
[here](http://blogs.aws.amazon.com/security/post/Tx3D6U6WSFGOK2H/A-New-and-Standardized-Way-to-Manage-Credentials-in-the-AWS-SDKs#).

To specifically release to AWS, use `component release cloud`. That
proves useful when you do a release but the AWS step fails due for
instance to bad credentials.

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
