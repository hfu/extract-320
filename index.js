const config = require('config')
const { spawnSync } = require('child_process')
const tilebelt = require('@mapbox/tilebelt')
const fs = require('fs')

// configuration constants
const z = config.get('z')
const minx = config.get('minx')
const miny = config.get('miny')
const maxx = config.get('maxx')
const maxy = config.get('maxy')
const configPath = config.get('configPath')
const planetPath = config.get('planetPath')

for (let x = minx; x <= maxx; x++) {
  for (let y = miny; y <= maxy; y++) {
    let configuration = {
      extracts: [],
      directory: 'pbf'
    }
    configuration.extracts.push({
      output: `${z}-${x}-${y}.pbf`,
      output_format: 'pbf',
      bbox: tilebelt.tileToBBOX([x, y, z])
    })
    fs.writeFileSync(
      configPath,
      JSON.stringify(configuration, null, 2)
    )
    spawnSync('osmium', [
      'extract', '--config', configPath, 
      '--strategy=smart', 
      '--verbose', '--overwrite', '--progress', 
      planetPath],
      { stdio: 'inherit' }
    )
  }
}

