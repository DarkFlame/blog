var specificity = require('specificity');
let res  = specificity.calculate('ul#nav li.active.active a:not(#test)::first-letter');   // [{ specificity: '0,1,1,3' }]
console.log(res)