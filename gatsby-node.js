var rucksack = require('rucksack-css')
var lost = require("lost")
var cssnext = require("postcss-cssnext")
import Shell from 'child_process'

function postBuild(pages, callback) {
  // Files in the static directory to be moved to public
  const staticFiles = [
    'manifest.json',
    'CNAME',
  ]

  Shell.execSync(`cp -r ./static/{${staticFiles.join(',')}} public/`)
  callback()
}

export { postBuild }

exports.modifyWebpackConfig = function(config, env) {
    config.merge({
        postcss: [
            lost(),
            rucksack(),
            cssnext({
                browsers: ['>1%', 'last 2 versions']
            })
        ]
    })

    config.loader('svg', {
       test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
       loader: 'file-loader',
    })

    return config
};
