#!/usr/bin/env node
var args = require('minimist')(process.argv.slice(2))
var localtunnel = require('localtunnel')
var psi = require('psi')
var portUsed = require('tcp-port-used')
var debug = require('debug')('pagespeed-cli')

var port = args.p || args.port
var strategy = args.s || args.strategy || 'mobile'

if (!port) {
  console.log('Missing "port" parameter')
  process.exit(1)
}

console.log('Using strategy "' + strategy + '"')

debug('Checking if local port ' + port + ' is in use')
portUsed.check(port, '127.0.0.1').then(function (inUse) {
  if (!inUse) {
    console.log('Local port ' + port + ' is not in use')
    process.exit(1)
  }

  tunnelPSI(port)
})

function tunnelPSI (port) {
  debug('Starting tunnel')
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
}

function getPagespeed (url) {
  // We **have** to set a threshold of 1 here, else the output may throw an error
  // if the default threshold is not met, resulting into the `psi` promise never getting resolved
  var options = {
    threshold: 1,
    strategy: strategy.toString()
  }

  return new Promise(function (resolve, reject) {
    psi.output(url, options).then(function () {
      // We also have to wrap the resolving into a timeout, since `psi` resolves
      // before everything finished writing into the console
      setTimeout(resolve, 500)
    }).catch(reject)
  })
}
