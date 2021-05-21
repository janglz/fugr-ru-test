import React from 'react';
import Spinner from './Spinner.js';
import Pagination from './Pagination.js'
import Table from './Table.js'
import AddUserForm from './AddUserForm'
// import SearchBar from './SearchBar'
//import SimpleReactValidator from 'simple-react-validator';

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
            filtered: null,
        };

        this.handleChanges = this.handleChanges.bind(this);
        this.selectRows = this.selectRows.bind(this)
        this.getData = this.getData.bind(this);
        this.addUser = this.addUser.bind(this);
        // this.sortUsers = this.sortUsers.bind(this);
        this.selectPage = this.selectPage.bind(this);
    }

    async getData(rows = this.state.rows) {
        const data = await fetch(`http://www.filltext.com/?rows=${rows}&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}`).
            then(response => response.json())
        return data;
    }

    async handleChanges(users) {
        const pages = await Math.round(users.length / 50); //по 50 элементов на страницу
        this.setState({
            users: users,
            pages: pages,
            isLoaded: true,
        })
    }

    async selectPage(page = 1) {
        await this.setState({
            isLoaded: false,
            page: page,
        })
        this.handleChanges(this.state.users)
    }

    filterUsers = (users) => {
        //const pages =  Math.round (users.length / 50) 
        this.setState({
            filtered: users,
        })
    }
    
    async selectRows(e) {
        this.setState({
            rows: e.target.value,
            isLoaded: false,
        });
        try {
            this.getData(e.target.value).then(result=>{
                this.setState({
                    data: result,
                    
                })
                this.handleChanges(result)
                this.filterUsers(result)
            })
        } catch (e) {
            console.log(e)
        }
    }

    addUser = async (user) => {
        const allUsers = [user, ...this.state.data];
        await this.handleChanges(allUsers)
        const filtered = [user, ...this.state.filtered]
        await this.setState({
            data: allUsers,
            filtered: filtered,
        })
        console.log(this.state)
    }

    render() {
        if (!this.state.isLoaded) return <Spinner />
        const container = !this.state.rows ? 
        <h1>Выбирайте кнопочку...</h1> :
        (<div>
            <Pagination
                page={this.state.page}
                pages={this.state.pages}
                onSelectPage={this.selectPage}
            />
            {/* <AddUserForm 
                onAddUser={this.addUser}
            /> */}
            <Table
                onAddUser={this.addUser}
                isLoaded={this.state.isLoaded}
                page={this.state.page}
                users={this.state.users}
                onHandleChange={this.handleChanges}
                onFilterUsers={this.filterUsers}
                filteredUsers={this.state.filtered}
                onSelectPage={this.selectPage}
                data={this.state.data}
            // sortUsers={this.sortUsers}
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