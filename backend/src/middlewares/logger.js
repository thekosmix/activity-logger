const logger = (req, res, next) => {
  const oldSend = res.send;
  const oldJson = res.json;
  let responseBody = null;

  res.send = function (body) {
    try {
      responseBody = JSON.parse(body);
    } catch (e) {
      responseBody = body;
    }
    return oldSend.apply(res, arguments);
  };

  res.json = function (body) {
    responseBody = body;
    return oldJson.apply(res, arguments);
  };

  res.on('finish', () => {
    if (res.statusCode < 400) {
      console.log(
        JSON.stringify(
          {
            level: 'info',
            request: {
              method: req.method,
              url: req.originalUrl,
              body: req.body,
            },
            response: {
              statusCode: res.statusCode,
              body: responseBody,
            },
          },
          null,
          2
        )
      );
    }
  });

  next();
};

const errorLogger = (err, req, res, next) => {
  console.error(
    JSON.stringify(
      {
        level: 'error',
        request: {
          method: req.method,
          url: req.originalUrl,
          body: req.body,
        },
        error: {
          message: err.message,
          stack: err.stack,
        },
      },
      null,
      2
    )
  );
  next(err);
};

module.exports = { logger, errorLogger };