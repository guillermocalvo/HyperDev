const { Component } = React
const {
  Image,
  Message,
  Form
} = window

class Postcard extends Component {
  constructor() {
    super()
    this.state = {
      flipped: false
    }
  }
  
  _handleFlipClick() {
    this.setState({
      flipped: !this.state.flipped
    })
  }

  render() {
    const { flipped } = this.state
    const planeClass = flipped ? 'Plane is-flipped' : 'Plane'
    return (
      <div className="Postcard">
        <div className="Postcard__wrapper">
          <div className={planeClass}>
            <Image {...this.props} />
            <Message fields={this.props.recipient} />
          </div>
          <div className="Postcard__actions">
            <button
              className="Postcard__actions__flip"
              onClick={this._handleFlipClick.bind(this)}>
              Flip Postcard
            </button>
            <button
              className="Postcard__actions__clear"
              onClick={this.props.onResetClick}>
              Clear Image
            </button>
          </div>
        </div>
      </div>
    )
  }
}

window.Postcard = Postcard