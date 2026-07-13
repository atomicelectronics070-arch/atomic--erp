const { File } = require('megajs');

async function exploreMega() {
    const url = 'https://mega.nz/folder/94923S5Y#0EZpQgDUNRlmvBXV7oCj5w';
    console.log("Loading folder:", url);
    const folder = File.fromURL(url);

    await folder.loadAttributes();

    console.log("Folder name:", folder.name);
    
    function printTree(f, indent = '') {
        console.log(`${indent}- ${f.name} (Dir: ${f.directory}, Size: ${f.size})`);
        if (f.children) {
            for (const child of f.children) {
                printTree(child, indent + '  ');
            }
        }
    }

    printTree(folder);
}

exploreMega().catch(console.error);
