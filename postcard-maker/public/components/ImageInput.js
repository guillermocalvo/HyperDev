const { Component } = React
const reader = new FileReader()
const request = superagent

class ImageInput extends Component {
 
  _handleChange(evt) {
    const file = evt.target.files[0]
    reader.onload = (e) => {
      this.props.updateState({
        previewUrl: e.target.result
      })
    }
    reader.readAsDataURL(file)
    this._uploadFile(file)
  }
  
  _uploadFile(file) {
    let formData = new FormData()
    formData.append("image", file)
    request.post("/upload")
      .send(formData)
      .end((err, resp) => {
        const { public_id } = resp.body
        this.props.updateState({
          uploaded: true,
          cloudinaryId: public_id
        })
      })
  }
  
  render() {
    return (
      <div className="ImageInput__wrapper">
        <input
          className="ImageInput"
          type="file"
          accept="image/*"
          onChange={this._handleChange.bind(this)} />
        <div className="ImageInput__message">
          <h1 className="ImageInput__headline">Send a Postcard from your Browser!</h1>
          <p className="ImageInput__text">Simply click to upload an image, drag the crop area until you’re happy, fill out your recipient’s address and fire away!</p>
        </div>
      </div>
    )
  }
}

window.ImageInput = ImageInput