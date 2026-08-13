import {preview} from "./template-files/template1";

const files = import.meta.glob('./template-files/*.js', { eager: true })

const templates = {}
Object.keys(files).forEach(key => {
  let templateKey = key.replace('./template-files/', '').replace(/\.js$/, '');
  templates[templateKey] = Object.assign(templates[templateKey] || {}, files[key].default)
})

export default templates
