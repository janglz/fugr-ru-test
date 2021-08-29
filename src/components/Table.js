import React from 'react';
import UserInfo from './UserInfo.js';
import AddUserForm from './AddUserForm';

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUser: null,
        };  
    }

    selectUser = (e) => {
        const userId = e.currentTarget.getAttribute('value');
        const user = this.props.users.find(user =>  this.props.users.indexOf(user) === Number(userId));
        const no = 'данные не определены'
        this.setState({
            selectedUser: {
                firstName: user.firstName,
                lastName: user.lastName,
                description: user.description || no,
                streetAddress: user.address?.streetAddress || no,
                city: user.address?.city || no,
                state: user.address?.state || no,
                zip: user.address?.zip || no
            }
        })
    }
    clearSelectedUser = () => {
        this.setState({
            selectedUser: null,
        })
    }
    
    search = (e) => {
        e.preventDefault();
        this.props.onSearch();
    }
    
    render() {
        const setClass = (el) => {
            let theadClass = 'th '
            if (this.props.sortedBy === el) theadClass += 'selected';
            if (this.props.sortedBy === `${el}-reverse`) theadClass += 'selected reversed'
            return theadClass;
        }

        const fields = ['id', 'firstName', 'lastName', 'email', 'phone']
        
        const rows = this.props.users.map((user, i) => {
            return (
                <tr onClick={this.selectUser} key={i} value={i}>{
                    fields.map(el => {
                        return <td key={el}>{user[el]}</td>
                    })
                }</tr>
            )
        })

        const head = (
            <tr>{
                fields.map(el => {
                    return <th onClick={this.props.onSort} value={el} key={el}>{el}<span className={`${setClass(el)}`} ></span></th>
                })
            }</tr>
        )
        

        const searchBar = (
            <form className="search-bar" onSubmit={this.search}>
                <label>
                    Фильтр:
                    <input type="text" name="search" onInput={this.props.onFilter} value={String (this.props.searchQuery)} />
                </label>
                <input type="submit" value="поиск" />
            </form>
        )

        const tableContent = this.props.users[0] ?  (
            (<div>
                <table className="table">
                    <thead>{head}</thead>
                    <tbody>{rows}</tbody>
                </table>
                <UserInfo user={this.state.selectedUser} onClose={this.clearSelectedUser}/>
            </div>)
        ) :  (<h4>не найдено совпадений</h4>) 

        return (
            <div className="table-container">
                <div className="serch-bar-container">
                    {searchBar}
                    <AddUserForm onAddUser={this.props.onAddUser} />
                </div>
                {tableContent}
            </div>
        )
    }
}

export default Table;