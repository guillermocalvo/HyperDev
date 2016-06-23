const { Component } = React
const request = superagent

class Form extends Component {
  
  _updateField(fieldId, evt) {
    let field = this.props.fields[fieldId]
    field.value = evt.target.value
    this.props.updateState({
      [fieldId]: field
    })
  }

  _renderField(fieldId) {
    if(fieldId == "address_country") return false
    const field = this.props.fields[fieldId]
    return (
      <input
        className="Input"
        style={field.style}
        placeholder={field.label}
        value={field.value}
        key={fieldId}
        onChange={this._updateField.bind(this, fieldId)}
        ref={fieldId} />
    )
  }
  
  _renderCountries() {
    const { address_country } = this.props.fields
    return (
      <select
        value={address_country.value}
        placeholder="Loading"
        onChange={this._updateField.bind(this, 'address_country')}
        className="Input">  
        {address_country.options.map((country) => {
          return (
            <option key={country.short_name} placheolder="Country" value={country.short_name}>
              {country.name}
            </option>
          )
        })}
      </select>
    )
  }

  render() {
    const { remaining } = this.props
    const submitClass = canSubmit(this.props.uploaded, this.props.fields, remaining) ? "Form__submit" : "Form__submit disabled"
    return (
      <form className="Form">
        <div className="Form__wrapper">
          <div className="Form__fields">
            {Object.keys(this.props.fields).map(this._renderField.bind(this))}
            {this._renderCountries()}
          </div>
          <button ref={(btn) => {
            if (btn != null) {
              btn.onclick = this.props.onSubmit
            }
				   }} className={submitClass}>
            Send this sucker!
          </button>
          <div className="Form__hint">
            Only $2USD delivered!
          </div>
        </div>
      </form>
    )
  }
}

function canSubmit(uploaded, fields, remaining) {
  if(!uploaded || remaining == 0) return false
  let submit = true
  Object.keys(fields).map((f) => {
    if(f !== "address_line2") {
      if(fields[f].value.length == 0) {
        submit = false
      }
    }
  })
  return submit
}

window.Form = Form