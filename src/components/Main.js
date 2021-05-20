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
            rows: 32,
        };

        this.handleChanges = this.handleChanges.bind(this);
        this.loadUsers = this.loadUsers.bind(this)
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

    async handleChanges(data) {
        if (!data) data = this.getData()
        const pages = await Math.round(data.length / 50); //по 50 элементов на страницу
        this.setState({
            users: data,
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

    async loadUsers(e) {
        this.setState({
            rows: e.target.value,
            isLoaded: false,
        });
        //console.log(e.target.value)
        try {
            this.getData(e.target.value).then(result=>{
                this.handleChanges(result)
            })
            // this.handleChanges(data)
        } catch (e) {
            console.log(e)
        }
    }

    componentDidMount() {
    }

    addUser(user) {
        //user.validate прикрутим библу
        const allUsers = [...this.state.users, user];
        this.handleChanges(allUsers)
    }

    // async sortUsers(e) {
    //     this.setState({
    //         isLoaded: false
    //     })
    //     const field = e.target.value;
    //     const sorted = await this.state.users.sort((first, second) => first[field] - second[field])
    //     this.handleChanges(sorted);
    // }

    render() {
        if (!this.state.isLoaded) return <Spinner />
        return (
            <div>
                <button onClick={this.loadUsers} value="32">small</button>
                <button onClick={this.loadUsers} value="1000">big</button>
                <Pagination 
                    page={this.state.page}
                    pages={this.state.pages}
                    onSelectPage={this.selectPage}
                />
                <Table 
                    isLoaded={this.state.isLoaded}
                    page={this.state.page}
                    users={this.state.users}
                    onHandleChange={this.handleChanges} 
                    addUser={this.addUser}
                    // sortUsers={this.sortUsers}
                />
            </div>
        )
    }
}

export default Main;