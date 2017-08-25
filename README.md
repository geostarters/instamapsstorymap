# Instamaps Story Map

## Building the library
### Building storymap.min.js
To build the library the [node package manager](https://www.npmjs.com/) and [gulp](https://gulpjs.com/) task runner are used.
Clone this repository and, after installing npm, execute the following commands to install all the prerequisites and build the library:

```
npm install
gulp build
```

A minified library will be generated under the _/build/js/_ directory.

### Testing the library
To test the library execute the following command to install all the dependencies

```
cd test
npm install
```

After the dependencies are installed, open the _runner.html_ file to execute all the tests.

### Generating the documentation
To generate the documentation execute the following command:

```
gulp doc
```

The documentation will be generated under the _/docs/_ directory.

## License

Copyright (c) 2017- Geostarters (BEERWARE License)  
See LICENSE file for more info.