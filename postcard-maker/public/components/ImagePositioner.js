const { Component } = React
const reader = new FileReader()

class ImagePositioner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offsetX: props.offsetX,
      offsetY: props.offsetY
    }
    this._handleMouseUp = this._handleMouseUp.bind(this)
  }
  
  _handleTouchStart(evt) {
    evt.preventDefault()
    this._handleMouseDown(evt.touches[0])
  }
  
  _handleTouchMove(evt) {
    evt.preventDefault()
    this._handleMouseMove(evt.touches[0])
  }
  
  _handleMouseDown(evt) {
    const { clientX, clientY, target } = evt
    this.props.updateState({
      positioning: true
    })
    this.setState({
      originX: clientX,
      originY: clientY,
      clientWidth: target.clientWidth,
      clientHeight: target.clientHeight, 
    })
    window.addEventListener("mouseup", this._handleMouseUp)
    window.addEventListener("touchend", this._handleMouseUp)
  }
  
  _handleMouseMove(evt) {
    if(this.props.positioning) {
      const { offsetX, offsetY } = getOffset(this.state, this.props, evt)
      this.props.updateState({
        offsetX,
        offsetY
      })
    }
  }
  
  _handleMouseUp(evt) {
    const { offsetX, offsetY } = this.props
    this.setState({
      offsetX,
      offsetY,
    })
    this.props.updateState({
      positioning: false
    })
    window.removeEventListener("mouseup", this._handleMouseUp)
    window.removeEventListener("touchend", this._handleMouseUp)
  }
  
  render() {
    return (
      <div
        draggable={false}
        className="ImagePositioner"
        onTouchStart={this._handleTouchStart.bind(this)}
        onTouchMove={this._handleTouchMove.bind(this)}
        onMouseDown={this._handleMouseDown.bind(this)}
        onMouseMove={this._handleMouseMove.bind(this)}>
      </div>
    )
  }
}

window.ImagePositioner = ImagePositioner