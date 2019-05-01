// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require( 'fs' );
const {shell} = require('electron')

const target = document.getElementById( 'target' );
const currentDir = document.getElementById( 'currentDir' );

document.getElementById('selectBtn').addEventListener('click', ( e ) => {
    document.getElementById('dir').click();
});

document.getElementById('dir').addEventListener('input', ( e ) => {
    const dir = e.target.files[ 0 ].path;
    window.localStorage.multitrackDir = dir;
    currentDir.innerHTML = dir;

    if ( dir ) loadFiles( dir );
})

if ( window.localStorage.multitrackDir ) {
    currentDir.innerHTML = window.localStorage.multitrackDir;
    loadFiles( window.localStorage.multitrackDir );
}

function loadFiles( rootDir ) {

    target.innerHTML = '';

    fs.readdir( rootDir, (err, dir) => {

        // loop through base dir
        for (let i = 0, path; path = dir[i]; i++) {

                // check if project files of Zoom R16 exists
                checkForR16( path, rootDir );

                // check if projects of Ehx 95000
                checkFor95000( path, rootDir );

        }
    });
}

function checkForR16( path, rootDir ) {

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

        createPlayer( path, rootDir, 'AUDIO', 'Zoom R16' );

    }
}

function checkFor95000( path, rootDir ) {
    const projectFile = rootDir + '/' + path + '/TEMPO.TXT';

    if ( fs.existsSync( projectFile ) && path ) {
        const info = get9500ProjectInfo( projectFile );
        createPlayer( path, rootDir, '', 'Ehx95000 ' + info );
    }
}

function get9500ProjectInfo( projectFile ) {

    const infoRaw = fs.readFileSync( projectFile, 'utf8' );
    const info = infoRaw.match(/Tempo=( |\d+)(\d+)(.)(\d+)( )bpm/)[0].replace('Tempo=', '');

    return info;
}


function createPlayer( path, rootDir, audiopath, projectInfo ) {

    const projectElement = document.createElement( 'div' );

    projectElement.classList.add( 'project' );

    let audioList = '<ul>';
    let player = '<div class="player">';


    const audioDir = rootDir + '/' + path + '/' + audiopath;


    // console.log( audioDir );

    fs.readdir( audioDir, (err, dir) => {

        let hasSound = false;

        for (let a = 0, subpath; subpath = dir[a]; a++) {

            if ( subpath.includes('.WAV') || subpath.includes('.wav') ) {

                audioList = audioList + '<li>' + subpath + '</li>';
                if ( subpath[ 1 ] !== '.' ) player = player + '<ts-track title="' + subpath + '"><ts-source src="' + audioDir + '/' + subpath +'"></ts-source></ts-track>';
                if ( subpath[ 1 ] !== '.' ) {
                    hasSound = true;
                }
            }
        }

        player = player + '</div>';
        audioList = audioList + '</ul>';

        if ( projectInfo ) projectInfo = '| ' +  projectInfo;

        const openLink = ' <button class="opendir" data-dir="' + audioDir + '">open</button>';

        // projectElement.innerHTML = '<h3>' + path + '</h3>' + audioList + '<div><button class="play">play</button></div>';
        projectElement.innerHTML = '<header><h3>' + path + ' ' + projectInfo + '</h3><div class="buttonwrapper">' + openLink + '</div></h3>' + player;

        if ( hasSound ) {
            target.appendChild( projectElement );
        }

        jQuery(document).ready(function() {
            jQuery(".player").trackSwitch(); // All other players are default
            jQuery('.opendir').click('click', ( e ) => {
                openFolder( jQuery(e.target).data('dir') );
            })
        });

    } );
}

function openFolder( path ){
    shell.openItem( path );
}
