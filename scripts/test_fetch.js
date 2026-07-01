const fs = require('fs');

async function testFetch() {
  try {
    const res = await fetch('https://es.made-in-china.com/co_gxhongfa/product_Qt4-35-Small-Make-Brick-Machine-Manual-Concrete-Block-Making-Machine_yuunsgygyg.html');
    const text = await res.text();
    fs.writeFileSync('test_mic.html', text);
    console.log('Saved to test_mic.html');
  } catch (e) {
    console.error(e);
  }
}
testFetch();
