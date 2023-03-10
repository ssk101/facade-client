import { Define, Template, Styles, Attribute } from '../../lib/decorators.js'
import css from './sticky.styl'
import template from './sticky.pug'

@Define('facade')
@Styles(css)
@Template(template)
@Attribute('stickied', Boolean)
export default class Sticky extends HTMLElement {
  connected() {
    if(!this.stickied) return

    const sentinel = this.shadowRoot.querySelector('.sentinel')

    if(!sentinel) return

    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      const targetInfo = entries[0].boundingClientRect

      const rootBoundsInfo = entries[0].rootBounds
      if(!rootBoundsInfo) return

      if(targetInfo.bottom < rootBoundsInfo.top) {
        this.emit('sticky:stickied', { stickied: true })
      }

      if(
        targetInfo.bottom >= rootBoundsInfo.top &&
        targetInfo.bottom < rootBoundsInfo.bottom
      ) {
        this.emit('sticky:stickied', { stickied: false })
      }
    }, { threshold: 0.0 })

    this.intersectionObserver.observe(sentinel)
  }
}