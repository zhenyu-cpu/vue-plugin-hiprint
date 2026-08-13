import {preview} from "./template-files/template1";

const templateModules = import.meta.glob('./template-files/*.js', { eager: true })

const templates = {}
Object.keys(templateModules).forEach(key => {
  let templateKey = key.replace(/\.\//, '').replace(/(\.js)/, '');
  templates[templateKey] = Object.assign(templates[templateKey] || {}, templateModules[key].default)
})

export default templates
