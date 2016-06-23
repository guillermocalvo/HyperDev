const { Component } = React
const {
  Postcard,
  Form
} = window
const request = superagent

const init = {
  previewUrl: false,
  width: null,
  height: null,
  ratio: null,
  loaded: false,
  uploaded: false,
  cloudinaryId: null,
  offsetX: 50,
  offsetY: 50,
  positioning: false
}

const formFields = {
  name: {label: "Recipient Name", value: ""},
  address_line1: {label: "Address Line 1", value: ""} ,
  address_line2: {label: "Address Line 2", value: ""},
  address_city: {label: "City", value: ""},
  address_state: {label: "State", value: "", style: {width: "48%", marginRight: "4%"}},
  address_zip: {label: "Zip/Postcode", value: "", style: {width: "48%"}},
  address_country: {label: "Country", value: "US", options: []}
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      postcard: init,
      recipient: formFields,
      sending: false,
      sent: false,
      error: false,
      paymentError: false,
      remaining: null
    }
  }
  
  componentWillMount() {
    request.get("/countries").end((err, res) => {
      this._handleUpdateRecipient({
        address_country: Object.assign({},
          this.state.recipient.address_country,
          { options: res.body.data }
        )
      })
    })
  }
  
  componentDidMount() {
    this.handler = StripeCheckout.configure({
      key: 'pk_live_hYRlYBmgDBIT9XB0rSvTE76T',
      locale: 'auto',
      token: this._submitPayment.bind(this)
    })
  }
  
  _submitPayment(token) {
    this.setState({
      sending: true,
      error: false
    })
    request.post("/payments")
      .send(token)
      .end((err, res) => {
        if(!err) {
          this._submitPostcard(token.email)
        } else {
          this.setState({
            paymentError: true
          }) 
        }
    })
  }
  
  _submitPostcard(email) {
    let toFields = {}
    Object.keys(this.state.recipient).map((f) => {
      toFields[f] = this.state.recipient[f].value
    })
    const frontUrl = getCroppedPostcardUrl(this.state.postcard, "ungallery")
    const backUrl = 'https://cdn.hyperdev.com/us-east-1%3Afd5b6c61-eb84-4bb2-acbc-de9c5b61f568%2Fpostcard-back.png'
    request
      .post('postcard')
      .send({
        description: email,
        to: toFields,
        front: frontUrl,
        back: backUrl
      })
      .end((err, resp) => {
        if(err) {
          this.setState({
            sending: false,
            error: err,
            sent: false
          })
        } else {
          this.setState({
            sending: false,
            sent: true
          })
        }
        console.log(err, resp)
      })
  }
  
  _handleSubmit(evt) {
    evt.preventDefault()
    this.handler.open({
      name: 'Postcard!',
      description: 'Send a postcard',
      currency: "USD",
      amount: 200
    })
  }
  
  _handleResetClick() {
    this.setState({
      postcard: init
    })
  }
  
  _handleUpdatePostcard(newState) {
    this.setState({
      postcard: Object.assign({},
        this.state.postcard,
        newState
      )
    })
  }
  
  _handleUpdateRecipient(newState) {
    this.setState({
      recipient: Object.assign({},
        this.state.recipient,
        newState
      )
    })
  }

  render() {
    return (
      <div>
        {renderSubmitter(this.state)}
        <Postcard
          {...this.state.postcard}
          recipient={this.state.recipient}
          updateState={this._handleUpdatePostcard.bind(this)}
          onResetClick={this._handleResetClick.bind(this)} />
        <Form
          fields={this.state.recipient}
          uploaded={this.state.postcard.uploaded}
          remaining={this.state.remaining}
          updateState={this._handleUpdateRecipient.bind(this)}
          onSubmit={this._handleSubmit.bind(this)}/>
      </div>
    )
  }
}

function renderSubmitter({ error, sending, sent }) {
  if(!error && !sending && !sent) return false
  return (
    <div className="Submitter" onClick={(evt) => evt.stopPropagation()}>
      <div className="Submitter__wrapper">
        {sending &&
          <div className="Submitter__sending">
            Preparing your postcard for delivery
          </div> }
        {sent &&
          <div className="Submitter__sent">
            Your postcard was sent!
          </div> }
        {error &&
          <div className="Submitter__error">
            Oh no! We couldn't send your postcard
          </div> }
      </div>
    </div>
  )
}

window.App = App