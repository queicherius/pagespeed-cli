# pagespeed-cli

[![No Maintenance Intended](https://img.shields.io/badge/No%20Maintenance%20Intended-%E2%9C%95-red.svg?style=flat-square)](http://unmaintained.tech/)

> Getting Google PageSpeed Insights for a app running locally - directly in the command line

[`psi`](https://github.com/addyosmani/psi) + [`localtunnel`](https://github.com/localtunnel/localtunnel) = :heart:

![](screenshot.png)

## Install

```bash
npm install pagespeed-cli
```

## Usage

```bash
# For a example app running on localhost, port 8080
pagespeed-cli -p 8080

# For a example app running on localhost, port 8080 and with desktop strategy
pagespeed-cli -p 8080 -s desktop
```

## Debugging

This module uses [debug](https://github.com/visionmedia/debug).

```bash
DEBUG='pagespeed-cli' pagespeed-cli -p 8080
```

## Licence

MIT
