const { Component } = React

class Message extends Component {
 
  render() {
    let fields = Object.keys(this.props.fields).map(f => this.props.fields[f].value)
    const country = this.props.fields.address_country.options.filter((i) => {
      if(i.short_name == this.props.fields.address_country.value) {
        return i
      }
    })
    return (
      <div className="Message">
        <div className="Message__wrapper">
          <div className="Message__line">{fields[0]}</div>
          <div className="Message__line">{fields[1]}</div>
          {!!fields[2].length && <div className="Message__line">{fields[2]}</div>}
          <div className="Message__line">
            {fields[3]}{!!fields[4] && ", "}{fields[4]}{!!fields[5] && ", "}{fields[5]} 
          </div>
          <div className="Message__line">{country[0] && country[0].name || ""}</div>
        </div>
      </div>
    )
  }
}

window.Message = Message