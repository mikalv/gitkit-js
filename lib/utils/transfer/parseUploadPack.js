var throughFilter = require('through2-filter');
var combine = require('stream-combiner2');

var parsePktLines = require('./parsePktLines');
var parsePack = require('./parsePack');
var parsePktLineMeta = require('./parsePktLineMeta');

/*
    Parse an upload result into a list of packs

    @return {Stream<GitObject>}
*/
function parseUploadPack() {
    var filter = throughFilter.obj(function(line) {
        return line.type == parsePktLineMeta.TYPES.PACKFILE;
    });

    return combine.obj(
        // Parse as lines
        parsePktLines(),

        // Parse metatdata of lines
        parsePktLineMeta(),

        // Filter packs
        filter,

        // Parse pack as objects
        parsePack(),

        // Not sure why... But without this filter, .on('data') doesn't work
        throughFilter.obj(function() {
            return true;
        })
    );
}

module.exports = parseUploadPack;