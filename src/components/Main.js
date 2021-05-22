import React from 'react';
import Spinner from './Spinner.js';
import Pagination from './Pagination.js'
import Table from './Table.js'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            page: 1,
            pages: [],
            users: [],
            user: null,
            rows: null,
            data: null,
            usersToShow: [],
            searchQuery: '',
            sortedBy: null,
        };
    }

    getData = async (rows) => {
        const data = await fetch(`http://www.filltext.com/?rows=${rows}&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}`).
            then(response => response.json())
        return data;
    }

    selectPage = async (page) => {
        const pages = Math.ceil(this.state.users.length / 50);
        const curPage = page <= pages ? page : pages;
        await this.setState({
            page: curPage,
            pages: pages,
        })
        const users = await this.findUsersOnCurrentPage([...this.state.users]);
        await this.setState({ usersToShow: users, })
    }
    
    selectRows = async (e) => {
        this.setState({
            rows: e.target.value,
            isLoaded: false,
        });
        try {
            await this.getData(e.target.value).then(result=>{
                this.setState({
                    data: result,
                    users: result,
                    isLoaded: true,
                })  
            });
            await this.selectPage(1)
        } catch (e) {
            console.log(e)
        }
    }

    addUser = async (user) => {
        const allUsers = [user, ...this.state.data];
        const filtered = [user, ...this.state.users]
        await this.setState({
            data: allUsers,
            users: filtered,
        })
        await this.selectPage(1)
        
    }

    findUsersOnCurrentPage = (users) => {
        const offset = this.state.page * 50;
        return [...users.slice(offset - 50, offset)];    
    }

    search = async (users, query) => {
        if (!query || query === '') return users;

        let filteredUsers = await users.filter((user) => Object.values(user).find(entry=> {
            return String(entry).indexOf(query) !== -1;
        }));
        return filteredUsers;
    }

    sortUsers = async (e) => {
        const value = e.currentTarget.getAttribute('value');
        const sortedBy =
            this.state.sortedBy === value ?
            `${value}-reverse` : value
        const bool =
            sortedBy === value ?
            1 : -1;

        const sortByValue = (first, second) => first[value] > second[value] ? bool : -(bool)
        const sortedAllUsers = await [...this.state.data].sort(sortByValue);

        await this.setState( {
            sortedBy: sortedBy, 
        })
        if (this.state.searchQuery === '' || this.state.searchQuery === null) {  
            await this.setState({ 
                data: await sortedAllUsers, 
                users: sortedAllUsers,
                usersToShow: await this.findUsersOnCurrentPage(sortedAllUsers)
            })
        } else {
            const filtered = await this.search(sortedAllUsers, this.state.searchQuery); 
            const currentPageUsers = await this.findUsersOnCurrentPage(filtered);           
            await this.setState({ 
                usersToShow: await currentPageUsers,     
                users: filtered,
            })  
        }
    }


    filterUsers = async (e) => { //поиск по странице
        const query = await e.currentTarget.value
        await this.setState({
            searchQuery: query,
        })
        const currentPageUsers = await this.findUsersOnCurrentPage([...this.state.data]);  
        const filtered = await this.search(currentPageUsers, this.state.searchQuery);  
        await this.setState({
            usersToShow: filtered,
        })
    }

    searchUsers = async () => { //поиск по всем юзерам
        const query = this.state.searchQuery;
        const filtered = await this.search([...this.state.data], query); 
        await this.setState({
            users: filtered,
        })
        await this.selectPage(1) 
    }

    render() {
        if (!this.state.isLoaded) return <Spinner />
        const container = !this.state.rows ? 
        (<h1>Выбирайте кнопочку...</h1>)
        :
        (<div>
            <Pagination
                page={this.state.page}
                pages={this.state.pages}
                onSelectPage={this.selectPage}
            />
            <Table
                isLoaded={this.state.isLoaded}
                sortedBy={this.state.sortedBy}
                users={this.state.usersToShow}
                searchQuery={this.state.searchQuery}
                onAddUser={this.addUser}
                onFilter={this.filterUsers}
                onSearch={this.searchUsers}
                onSort={this.sortUsers}
            />
        </div>);
        return (
            <div>
                <button onClick={this.selectRows} value="32">Поменьше...</button>
                <button onClick={this.selectRows} value="1000">Побольше!</button>
                {container}
            </div>
        )
    }
}

export default Main;