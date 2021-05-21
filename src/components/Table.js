import React from 'react';
import Spinner from './Spinner.js';
import UserInfo from './UserInfo.js';
import AddUserForm from './AddUserForm';
import _ from 'lodash';

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: this.props.isLoaded,
            selectedUser: null,
            sortedBy: null,
            searchQuery: '',
        };
    }

    selectUser = (e) => {
        const userId = e.currentTarget.getAttribute('value');
        const user = this.props.users.find(user => user.id == userId);
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

    handleChanges = async (users) => {
        await this.setState({
            isLoaded: true,
        })
    }

    componentDidMount() {
        this.handleChanges(this.props.users);
        this.props.onFilterUsers(this.currentPageUsers(this.props.users))
    }

    sortUsers = async (e) => {
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

        const currentPageUsers = this.currentPageUsers(this.props.data)
        const filtered = await this.search(currentPageUsers, this.state.searchQuery)
        
        const sorted = await filtered.sort((first, second) => first[entry] > second[entry] ? bool : -(bool))

        this.setState({
            sortedBy: sortedBy,
        });
        this.props.onFilterUsers(this.currentPageUsers(sorted))

        this.handleChanges(filtered)
    }

    currentPageUsers = (users) => {
        const offset = this.props.page * 50;
        return users.slice(offset - 50, offset);
    }

    search = (users, query) => {
        if (!query) return users;
        const searchUsers = users.filter((user) => Object.values(user).find(entry=> {
            return String(entry).indexOf(query) !== -1;
        }))
        return searchUsers;
    }

    searchOnPage = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const query = await e.target.value;
        const usersOnPage = await this.currentPageUsers(this.props.data)
        const filtered = await this.search(usersOnPage, query)

        await this.setState({
            searchQuery: query,
        })
        this.props.onFilterUsers(filtered)
    }

    globalSearch = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        //const query = await e.target.getAttribute('value');
        await this.setState({
            // searchQuery: query,
            isLoaded: false,
        })
        
        const filtered = await this.search(this.props.data, this.state.searchQuery);
        await this.props.onHandleChange(filtered)
        await this.props.onSelectPage(1)
        await this.setState({
            isLoaded: true,
        })
    }

    
    
    render() {
        if (!this.state.isLoaded) return <Spinner />
        console.log(this.state)
        //this.props.onFilterUsers(this.currentPageUsers(this.props.users))
        const usersOnThisPage = this.currentPageUsers(this.props.users)

        const setClass = (el) => {
            let theadClass = 'th '
            if (this.state.sortedBy === el) theadClass += 'selected';
            if (this.state.sortedBy === `${el}-reverse`) theadClass += 'selected reversed'
            return theadClass;
        }

        const fields = ['id', 'firstName', 'lastName', 'email', 'phone']
        
        const rows = usersOnThisPage.map(user => {
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
                        return <th onClick={this.sortUsers} value={el} key={el}>{el}<span className={`${setClass(el)}`} ></span></th>
                    })
                }
            </tr>
        )
        

        const searchBar = (
            <form className="search-bar" onSubmit={this.globalSearch}>
                <label>
                    Поиск:
                    <input type="text" name="search" onInput={this.searchOnPage} defaultValue={this.state.searchQuery} value={String (this.state.searchQuery)}></input>
                </label>
                <input type="submit" value="поиск" />
            </form>
        )

        const tableContent = this.props.filteredUsers[0] ?  (
            (<div>
                <table className="table">
                    <thead>
                    {head}
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <UserInfo user={this.state.selectedUser} onClose={this.clearSelectedUser}/>
            </div>)
        ) :  (<h4>не найдено совпадений</h4>) 

        return (
            <div>
                {searchBar}
                <AddUserForm 
                    onAddUser={this.props.onAddUser}
                />
                {tableContent}
            </div>
        )
    }
}

export default Table;