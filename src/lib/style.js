export function constructStyles(styles = []) {
  const css = [styles].flat().join('\n')
  let constructedSheet

  try {
    constructedSheet = new CSSStyleSheet()
    constructedSheet.replaceSync(css)
  } catch (e) {
    // Browser does not support constructable stylesheets
  }

  return { css, constructedSheet }
}

export function appendStyles(styles = [], target) {
  const { css, constructedSheet } = constructStyles(styles)

  if(constructedSheet) {
    target.adoptedStyleSheets = [...target.adoptedStyleSheets, constructedSheet]
  } else {
    const actualTarget = target.head ? target.head : target

    actualTarget.appendChild(Object.assign(document.createElement('style'), {
      textContent: styles,
    }))
  }
}