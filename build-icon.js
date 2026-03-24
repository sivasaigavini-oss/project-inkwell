import sharp from 'sharp'; sharp('build/icon.svg').resize(1024, 1024).png().toFile('build/icon.png').then(()=>console.log('done')).catch(console.error);
