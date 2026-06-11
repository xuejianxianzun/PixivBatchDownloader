/** 如果某些图标需要放大或缩小，可以在这里具体设置 */
const iconScaleMap: Record<string, { scale: number }> = {
  // github: { scale: 0.9 },
}

function getUseHref(use: SVGUseElement) {
  const href = use.getAttribute('href') || use.getAttribute('xlink:href') || ''
  return href.startsWith('#') ? href.slice(1) : href
}

export function applyIconScale(svg: SVGSVGElement) {
  const use = svg.querySelector('use')
  if (!use) {
    return
  }

  const iconName = getUseHref(use)
  const config = iconScaleMap[iconName]

  if (!config) {
    svg.style.removeProperty('--icon-scale')
    return
  }

  svg.style.setProperty('--icon-scale', String(config.scale))
}

export function applyIconScaleIn(root: ParentNode = document) {
  const icons = root.querySelectorAll<SVGSVGElement>('svg.icon')
  icons.forEach((svg) => applyIconScale(svg))
}

function applyIconScaleForNode(node: Node) {
  if (!(node instanceof Element)) {
    return
  }

  if (node instanceof SVGSVGElement && node.matches('svg.icon')) {
    applyIconScale(node)
  }

  applyIconScaleIn(node)
}

function initIconScaleObserver() {
  applyIconScaleIn(document)

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => applyIconScaleForNode(node))
    }
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIconScaleObserver, {
    once: true,
  })
} else {
  initIconScaleObserver()
}
