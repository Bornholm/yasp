/* jshint node: true */
module.exports = function ErrorMiddlewareFactory() {
  return function(err, req, res) {

    console.error(err);

    // Unknown error, stop process
    if( !('status' in err) ) {
      res.status(500).send({
        error: 'UnknownError',
        message: 'Please contact your beloved administrator.'
      });
      return process.exit(1);
    }

    return res.status(err.status).send({
      error: err.name,
      message: err.message
    });

  };
};
