# Instamaps Story Map

A tool that allows you to combine different maps with text, photos, videos, etc. And explain, for example, the history of a country, a story, compare different physical phenomena or demonstrate the territorial imbalances of a certain socioeconomic variable.

**Editor demo:** http://betaserver2.icgc.cat/storymap/html/editor.html
**Demo:** http://betaserver2.icgc.cat/storymap/html/visor.html?id=9879c380-b7e5-11e7-913f-53fc7c9e8080

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

### Demo

More information at http://betaportal.icgc.cat/wordpress/storymaps/

[![Demo Vida de Pau Casals](http://betaportal.icgc.cat/wordpress/wp-content/uploads/2014/01/storymap_icgc_geostarters-1024x499.png)](http://betaserver2.icgc.cat/storymap/html/visor.html?id=9879c380-b7e5-11e7-913f-53fc7c9e8080)

## License

Copyright (c) 2017- Geostarters (MIT License)  
See LICENSE file for more info.