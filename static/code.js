const div = document.createElement('div')
div.style.position = 'fixed'
div.style.width = '100%'
div.style.height = '100%'
div.style.left = '0px'
div.style.top = '0px'
// div.style.backgroundColor = 'red'
document.body.appendChild(div)

window.a = 1

console.log(a, window, window.a)
