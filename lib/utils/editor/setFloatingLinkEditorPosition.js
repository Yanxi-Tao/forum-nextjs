export function setFloatingLinkToolbarPosition(
  targetRect,
  linkEditorToolbar,
  anchorElem
) {
  if (targetRect === null || anchorElem === null) {
    linkEditorToolbar.style.opacity = '0'
    linkEditorToolbar.style.top = '-10000px'
    linkEditorToolbar.style.left = '-10000px'
    return
  }

  const linkEditorToolbarRect = linkEditorToolbar.getBoundingClientRect()
  const anchorElemRect = anchorElem.getBoundingClientRect()
  let top = targetRect.top - anchorElemRect.top + targetRect.height + 3
  let left =
    targetRect.left -
    anchorElemRect.left +
    targetRect.width / 2 -
    linkEditorToolbarRect.width / 2

  linkEditorToolbar.style.opacity = '1'
  linkEditorToolbar.style.top = `${top}px`
  linkEditorToolbar.style.left = `${left}px`
}
