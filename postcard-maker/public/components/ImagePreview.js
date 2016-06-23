const { Component } = React

class ImagePreview extends Component {

  render() {
    const {
      previewUrl,
      offsetX,
      offsetY,
      ratio,
      style
    } = this.props
    const { width } = getDimensions(ratio, 100, 66.7)
    const fillWidth = ratio < 100/66.7
    const useRatio = fillWidth ? ratio :100/66.7
    const imageStyle = {
      backgroundImage: `url('${previewUrl}')`,
      width: `${width}%`,
      paddingTop: `${100/useRatio}%`,
      left: `${fillWidth ? 0 : offsetX}%`,
      top: `${fillWidth ? offsetY : 0}%`,
      transform: `translate(${fillWidth ? 0 : -offsetX}%, ${fillWidth ? -offsetY : 0}%)`
    }
    return (
      <div
        style={style}
        className="ImagePreview">
        <div
          className="ImagePreview__image"
          style={imageStyle} />
      </div>
    )
  }
}

window.ImagePreview = ImagePreview