export default () => ({
  i18n: {
    /**
     * All options are available here:
     * https://www.npmjs.com/package/i18n#list-of-all-configuration-options
     */

    locales: ['en', 'pl'],
 
    // fall back, e.g. from Dutch to German
    fallbacks: {
      // 'nl': 'de',
    },
 
    // you may alter a site wide default locale
    defaultLocale: 'en',
 
    // sets a custom cookie name to parse locale settings from - defaults to NULL
    cookie: null,
 
    // query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
    queryParameter: null,
 
    // where to store json files - defaults to './locales' relative to modules directory
    directory: `${__dirname}/../locales`,
 
    // control mode on directory creation - defaults to NULL which defaults to umask of process user. Setting has no effect on win.
    directoryPermissions: '755',
 
    // watch for changes in json files to reload locale on updates - defaults to false
    autoReload: false,
 
    // whether to write new locale information to disk - defaults to true
    updateFiles: false,
 
    // sync locale information across all files - defaults to false
    syncFiles: false,
 
    // what to use as the indentation unit - defaults to "\t"
    indent: '\t',
 
    // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
    extension: '.json',
 
    // setting prefix of json files name - default to none '' (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
    prefix: '',
 
    // enable object notation
    objectNotation: false,
 
    // Downcase locale when passed on queryParam; e.g. lang=en-US becomes
    // en-us.  When set to false, the queryParam value will be used as passed;
    // e.g. lang=en-US remains en-US.
    preserveLegacyCase: true,
  },
});
