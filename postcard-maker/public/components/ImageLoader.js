const { Component } = React

class ImageLoader extends Component {

  _handleLoad(evt) {
    const { naturalWidth, naturalHeight } = evt.target
    this.props.updateState({
      width: naturalWidth,
      height: naturalHeight,
      ratio: naturalWidth / naturalHeight,
      loaded: true
    })
  }

  render() {
    const {
      previewUrl,
    } = this.props
    return (
      <img src={previewUrl}
        width={0}
        height={0}
        onLoad={this._handleLoad.bind(this)} />
    )
  }
}

window.ImageLoader = ImageLoader