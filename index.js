#!/usr/bin/env node
var args = require('minimist')(process.argv.slice(2))
var localtunnel = require('localtunnel')
var psi = require('psi')
var debug = require('debug')('pagespeed-cli')

var port = args.p || args.port

if (!port) {
  console.log('Missing "port" parameter')
  process.exit(1)
}

debug('Starting tunnel to local port ' + port)
localtunnel(port, function (err, tunnel) {
  if (err) {
    console.log('Error creating tunnel', err.message)
    process.exit(1)
  }

  debug('Successfully created tunnel, getting page speed insights')
  getPagespeed(tunnel.url).then(function () {
    debug('Reporting done, exiting')
    tunnel.close()
    process.exit(0)
  })
})

function getPagespeed (url) {
  // We **have** to set a threshold of 1 here, else the output may throw an error
  // if the default threshold is not met, resulting into the `psi` promise never getting resolved
  var options = {threshold: 1}
  return new Promise(function (resolve) {
    psi.output(url, options).then(function () {
      // We also have to wrap the resolving into a timeout, since `psi` resolves
      // before everything finished writing into the console
      setTimeout(resolve, 500)
    })
  })
}
