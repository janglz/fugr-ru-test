import React from 'react';
import SimpleReactValidator from 'simple-react-validator';

class AddUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
        }
        this.validator = new SimpleReactValidator({
            autoForceUpdate: this,
            validators: {
                name: {
                    message: 'The :attribute must contains min. 4 letters',
                    rule: (val, params, validator) => {
                        return validator.helpers.testRegex(val, /^[a-zA-ZА-ЯЁа-яё]+$/i) && params.indexOf(val) === -1 && val.length > 3
                    },
                    required: true
                }
            }
        });
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const elem = e.currentTarget.value;
        const key = e.currentTarget.getAttribute('id')
        this.setState({
            [key]: elem
        })
        console.log(this.state)
    }

    openForm = () => {
        this.setState({ isActive: true })
    }

    closeForm = (e) => {
        this.setState({ isActive: false })
    }

    submitForm = (e) => {
        e.preventDefault();
        if (this.validator.allValid()) {
            const user = {
                id: Number(this.state.id),
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phone: this.state.phone,
            }
            this.props.onAddUser(user)
            this.closeForm()
        } else {
            this.validator.showMessages();
        }
    }

    render() {
        const addUserButton = (
            <button className="add-user" onClick={this.openForm}>Добавить нового пользователя</button>
        )

        const form = (
            <div className="overlay" onClick={this.closeForm}>
                <div className="modal" onClick={(e)=> e.stopPropagation()}>
                <h3>Добавить пользователя<button className="close-button" onClick={this.closeForm} >закрыть</button></h3>
                <div>
                <div className="form-group">
                    <label>ID</label>
                    <input
                        className="form-control"
                        defaultValue={this.state.id}
                        id="id"
                        onChange={this.handleChange}
                        onBlur={() => this.validator.showMessageFor('id')}
                    />
                    <span className="input-invalid">{this.validator.message('id', this.state.id, 'required|numeric|min:0,num')}</span>
                </div>
                <div className="form-group">
                    <label>firstName</label>
                    <input 
                        className="form-control" 
                        defaultValue={this.state.firstName} 
                        id="firstName" 
                        onChange={this.handleChange} 
                        onBlur={() => this.validator.showMessageFor('name')} 
                    />
                    <span className="input-invalid">{this.validator.message('name', this.state.firstName, 'required|name')}</span>
                </div>
                <div className="form-group">
                    <label>lastName</label>
                    <input 
                        className="form-control" 
                        defaultValue={this.state.lastName} 
                        id="lastName" 
                        onChange={this.handleChange} 
                        onBlur={() => this.validator.showMessageFor('last name')} 
                    />
                    <span className="input-invalid">{this.validator.message('last name', this.state.lastName, 'required|name')}</span>
                </div>
                <div className="form-group">
                    <label>email</label>
                    <input 
                        className="form-control" 
                        defaultValue={this.state.email} 
                        id="email" 
                        onChange={this.handleChange} 
                        onBlur={() => this.validator.showMessageFor('email')} 
                    />
                    <span className="input-invalid">{this.validator.message('email', this.state.email, 'required|email')}</span>
                </div>
                <div className="form-group">
                    <label>phone</label>
                    <input 
                        className="form-control"
                        defaultValue={this.state.phone} 
                        id="phone" 
                        onChange={this.handleChange} 
                        onBlur={() => this.validator.showMessageFor('phone')} 
                    />
                    <span className="input-invalid">{this.validator.message('phone', this.state.phone, 'required|phone')}</span>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={this.submitForm}
                    >Добавить в таблицу
                </button>
                </div>
            </div>
            </div>
        );
        return this.state.isActive ? form : addUserButton
    }
}


export default AddUserForm;