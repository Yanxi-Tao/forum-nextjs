export function setFloatingLinkToolbarPosition(targetRect, linkEditorToolbar) {
  if (targetRect === null) {
    linkEditorToolbar.style.opacity = '0'
    linkEditorToolbar.style.top = '-10000px'
    linkEditorToolbar.style.left = '-10000px'
    return
  }

  const linkEditorToolbarRect = linkEditorToolbar.getBoundingClientRect()
  let top = targetRect.top + targetRect.height + 5
  let left =
    targetRect.left + targetRect.width / 2 - linkEditorToolbarRect.width / 2

  linkEditorToolbar.style.opacity = '1'
  linkEditorToolbar.style.top = `${top}px`
  linkEditorToolbar.style.left = `${left}px`
}
