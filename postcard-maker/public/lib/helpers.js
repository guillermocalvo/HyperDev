window.getDimensions = function(ratio, parentWidth, parentHeight) {
  const parentRatio = parentWidth / parentHeight
  return {
    width: ratio > parentRatio ? parentHeight * ratio : parentWidth,
    height: ratio > parentRatio ? parentHeight : parentWidth / ratio
  }
}

window.getOffset = function(state, props, evt) {
  const {
    offsetX,
    offsetY,
    originX,
    originY,
    clientWidth,
    clientHeight
  } = state
  const { ratio } = props
  const { clientX, clientY } = evt
  const { width, height } = getDimensions(ratio, clientWidth, clientHeight)
  const normalisedWidth = width - clientWidth + 1
  const normalisedHeight = height - clientHeight + 1
  const deltaX = (originX - clientX) / normalisedWidth * 100
  const deltaY = (originY - clientY) / normalisedHeight * 100
  return {
    offsetX: normalisePercent(offsetX + deltaX),
    offsetY: normalisePercent(offsetY + deltaY)
  }
}

window.normalisePercent = function(percent) {
  if(percent > 100) {
    return 100
  } else if(percent < 0) {
    return 0
  } else return percent
}

window.getCroppedPostcardUrl = function(postcard, libraryId) {
  const {
    cloudinaryId,
    width,
    height,
    offsetX,
    offsetY
  } = postcard
  let cropX = Math.round(offsetX * width / 100) 
  let cropY = Math.round(offsetY * height / 100)
  return `http://res.cloudinary.com/${libraryId}/image/upload/w_1875,h_1275,c_fill,g_xy_center,x_${cropX},y_${cropY}/${cloudinaryId}.jpg`
}