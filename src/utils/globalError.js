export const globalErrorHandler = (err, req, res, next) => {

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.details[0].message,
      status: "Failed",
      errorType: "Validation Error"
    })
  }

  return res.status(err.status || 404).json({
    message: err.details[0].message,
    status: 'Failed'
  })
}