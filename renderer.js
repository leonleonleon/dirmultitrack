// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');

const target = document.getElementById('target');

document.getElementById('dir').addEventListener('input', ( e ) => {
    const dir = e.target.files[ 0 ].path;
    window.localStorage.multitrackDir = dir;

    if ( dir ) loadFiles( dir );
})

if ( window.localStorage.multitrackDir ) loadFiles( window.localStorage.multitrackDir );


function loadFiles( rootDir ) {

    target.innerHTML = '';

    fs.readdir( rootDir, (err, dir) => {

        // loop through base dir
        for (let i = 0, path; path = dir[i]; i++) {

                // check if project file exists

                const projectFile = rootDir + '/' + path + '/PRJDATA.ZDT';
                const fxFile = rootDir + '/' + path + '/EFXDATA.ZDT';

                if ( fs.existsSync( projectFile ) && path ) {


                    // console.log( path );

                    // fs.readFile( projectFile, 'utf8', function( err, contents ) {
                    //     console.log( 'prj: ', contents );

                    // } );

                    // fs.readFile( fxFile, 'utf8', function( err, contents ) {
                    //     console.log( 'fx: ', contents );
                    // });

                    // first = false;

                    const projectElement = document.createElement( 'div' );

                    let audioList = '<ul>';
                    let player = '<div class="player">';


                    const audioDir = cfDirectory + '/' + path + '/AUDIO';


                    // console.log( audioDir );

                    fs.readdir( audioDir, (err, dir) => {

                        let hasSound = false;

                        for (let a = 0, subpath; subpath = dir[a]; a++) {
                            audioList = audioList + '<li>' + subpath + '</li>';
                            if ( subpath[ 1 ] !== '.' ) player = player + '<ts-track title="' + subpath + '"><ts-source src="' + audioDir + '/' + subpath +'"></ts-source></ts-track>';
                            if ( subpath[ 1 ] !== '.' ) {
                                hasSound = true;
                            }
                        }

                        player = player + '</div>';
                        audioList = audioList + '</ul>';

                        // projectElement.innerHTML = '<h3>' + path + '</h3>' + audioList + '<div><button class="play">play</button></div>';
                        projectElement.innerHTML = '<h3>' + path + '</h3>' + player;

                        if ( hasSound ) {
                            target.appendChild( projectElement );
                        }

                        jQuery(document).ready(function() {
                            jQuery(".player").trackSwitch(); // All other players are default
                        });

                    } );
                }


        }
    });
}
