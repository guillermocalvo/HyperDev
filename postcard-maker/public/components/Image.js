const { Component } = React
const {
  ImageInput,
  ImagePreview,
  ImageLoader,
  ImagePositioner
} = window

class Image extends Component {

  render() {
    const {
      previewUrl,
      loaded,
      positioning
    } = this.props
    return (
      <div className="Image">
        {!loaded && previewUrl &&
          <ImageLoader
            {...this.props} /> }
        {loaded &&
          <ImagePreview
            {...this.props}
            style={{overflow: "hidden"}} /> }
        {positioning &&
          <ImagePreview
            {...this.props}
            style={{opacity: 0.5}}/> }
        {loaded &&
          <ImagePositioner
            {...this.props} /> }
        {!previewUrl &&
          <ImageInput
            {...this.props} /> }
      </div>
    )
  }
}

window.Image = Image