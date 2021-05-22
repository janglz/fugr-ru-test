import React from 'react';

class UserInfo extends React.Component {
    render() {  
        const user = this.props.user;

        return (
            this.props.user ?
            (<div className="user-info" onClick={(e) => e.stopPropagation()}>
                <div>
                    <p>Выбран пользователь <b>{user.firstName} {user.lastName}</b></p>
                    <p>Описание:
                    <textarea defaultValue={user.description}></textarea>
                    </p>
                    <p>Адрес проживания: <b>{user.streetAddress}</b></p>
                    <p>Город: <b>{user.city}</b></p>
                    <p>Провинция/штат: <b>{user.state}</b></p>
                    <p>Индекс: <b>{user.zip}</b></p>
                    <button className="close-button" onClick={this.props.onClose}>X</button>
                </div>
            </div>)
            :
            ('')
        )
    }
}

export default UserInfo;