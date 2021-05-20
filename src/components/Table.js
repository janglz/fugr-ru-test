import React from 'react';
import Spinner from './Spinner.js';
import UserInfo from './UserInfo.js'
import _ from 'lodash';

// const search = (users, query) => {
//     const currentUsers = users.filter(user=> _.find(user, query))
//     this.setState({
//         searchQuery: query,
//         usersOnPage: currentUsers,
//     })
// }

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            selectedUser: null,
            sortedBy: null,
            usersOnPage: null,
            searchQuery: null,
            filteredUsers: null,
        };

        this.sortUsers = this.sortUsers.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.search = this.search.bind(this);
        this.clearSelectedUser = this.clearSelectedUser.bind(this);
        this.globalSearch = this.globalSearch.bind(this);
        this.fillPage = this.fillPage.bind(this);
    }

    selectUser(e) {
        const userId = e.currentTarget.getAttribute('value');
        const user = this.props.users.find(user => user.id == userId);
        this.setState({
            selectedUser: {
                firstName: user.firstName,
                lastName: user.lastName,
                description: user.description,
                streetAddress: user.address.streetAddress,
                city: user.address.city,
                state: user.address.state,
                zip: user.address.zip
            }
        })
    }
    clearSelectedUser() {
        this.setState({
            selectedUser: null,
        })
    }

    componentDidMount() {
        this.setState({
            filteredUsers: this.props.users,
            usersOnPage: this.props.users,
            isLoaded: true,
        })
        // this.fillPage(this.state.users)
    }

    async sortUsers(e) {
        this.setState({
            isLoaded:false,
        })
        const entry = e.currentTarget.getAttribute('value');
        const sortedBy = 
        this.state.sortedBy === entry ?
            `${entry}-reverse` : entry
        const bool = 
            sortedBy === entry ?
            1 : -1;
        const sorted = await this.props.users.sort((first, second) => first[entry] > second[entry] ? bool : -(bool))
        
        await this.props.onHandleChange(sorted).
        then(()=>{
            // this.search(sorted, this.state.query)
            this.fillPage(sorted);
            this.setState({
                // filteredUsers: filtered,
                sortedBy: sortedBy,
                isLoaded: true,
            });
        })
        console.log(sorted)
    }

    fillPage(users) {
        console.log(this.props.users)
        const offset = this.props.page * 50;
        const currentUsers = users.slice(offset - 50, offset);
        this.setState({
            usersOnPage: currentUsers,
            isLoaded: true,
        })
    }

    async search(users, query) {
        const searchUsers = users.filter((user) => Object.values(user).find(entry=> {
            return String(entry).indexOf(query) != -1
        }))

        const filtered = query? searchUsers : users
        
        await this.setState({
            searchQuery: query,
            filteredUsers: filtered,
        })
    }

    async globalSearch(e){
        this.setState({
            isLoaded: false,
        })
        e.preventDefault();
        this.search(this.props.users, this.state.searchQuery);

        //this.props.onHandleChange(this.props.users) 
        this.props.onHandleChange() //отправит запрос на сервер и будет искать в результатах ответа
        this.setState({
            isLoaded: true,
        })
    }

    
    
    render() {
        if (!this.state.isLoaded) return <Spinner />
       
        if (!this.state.filteredUsers) return (<h4>не найдено совпадений</h4>);

        const fields = ['id', 'firstName', 'lastName', 'email', 'phone']
        
        const rows = this.state.filteredUsers.map(user => {
            let id = _.uniqueId();
            return (
                <tr onClick={this.selectUser} key={user.id + id} value={user.id}>
                    {
                        fields.map(el => {
                            return <td key={el}>{user[el]}</td>
                        })
                    }
                </tr>
            )
        })

        const head = (
            <tr>
                {
                    fields.map(el => {
                        return <th onClick={this.sortUsers} value={el} key={el}>{el}<span className={this.state.sortedBy === el? 'sorted' : ''} ></span></th>
                    })
                }
            </tr>
        )
        

        const searchBar = (
            <form onSubmit={this.globalSearch}>
                <label>
                    Имя:
                    <input type="text" name="search" onInput={(e) => this.search(this.state.usersOnPage, e.currentTarget.value)}/>
                </label>
                <input type="submit" value="найти" />
            </form>
        )

        return (
            <div>
                {searchBar}
                {/* {addUser} */}
                <table className="table">
                    <thead>
                    {head}
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <UserInfo user={this.state.selectedUser} onClose={this.clearSelectedUser}/>
            </div>
        )
    }
}

export default Table;