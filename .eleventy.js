const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
// If not already added from previous tip
const slugify = require("slugify");

// 11ty configuration
const
  dev = global.dev  = (process.env.ELEVENTY_ENV === 'development'),
  now = new Date();


module.exports = config => {

  /* --- PLUGINS --- */

  // navigation
  config.addPlugin( require('@11ty/eleventy-navigation') );


  /* --- TRANSFORMS -- */

  // inline assets
  config.addTransform('inline', require('./lib/transforms/inline'));

  // minify HTML
  config.addTransform('htmlminify', require('./lib/transforms/htmlminify'));

  // CSS processing
  config.addTransform('postcss', require('./lib/transforms/postcss'));


  /* --- FILTERS --- */

  // format dates
  const dateformat = require('./lib/filters/dateformat');
  config.addFilter('datefriendly', dateformat.friendly);
  config.addFilter('dateymd', dateformat.ymd);

  // format word count and reading time
  config.addFilter('readtime', require('./lib/filters/readtime'));

  config.addPassthroughCopy("./src/resources");
  config.addPassthroughCopy("./src/favicon.ico");
  config.addPassthroughCopy("./src/favicon-16x16.png");
  config.addPassthroughCopy("./src/favicon-32x32.png");
  /* --- SHORTCODES --- */

  // page navigation
  config.addShortcode('navlist', require('./lib/shortcodes/navlist.js'));


  /* --- CUSTOM COLLECTIONS --- */

  // chapter collection (in src/chapters)
  config.addCollection('chapter', collection =>
      collection.getFilteredByGlob('./src/chapter/*.md')
  );


  /* --- WATCH FOLDERS --- */

  config.addWatchTarget('./src/scss/');
  config.addWatchTarget('./src/js/');

  config.addShortcode("h", function (level = 1, label = "") {
    const slug = config.javascriptFunctions.slug;
    const tag = `h${level}`;
    return `<${ tag } id="${ slug(label) }"><a aria-labelledby="${ slug(label) }" href="#${ slug(label) }"><span hidden>#</span></a>${ label }</${ tag }>`;
  });


// This is the part that tells 11ty to swap to our custom config


  // 11ty defaults
  return {

    dir: {
      input: 'src',
      output: 'build'
    }

  };
};
