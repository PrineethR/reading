const marked = require('marked');
const renderer = new marked.Renderer();
renderer.image = function(token) {
    console.log("Image args:", arguments.length, typeof token, token);
    return '<img src="TEST">';
};
marked.use({ renderer });
console.log(marked.parse('![A beautiful exhibition](https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1600&q=80)'));
