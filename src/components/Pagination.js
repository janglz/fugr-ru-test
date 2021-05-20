import React from 'react';
import _ from 'lodash';

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: this.props.pages,
            page: this.props.page,
        };

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e) {
        e.preventDefault();
        
        const page = Number (_.last(e.target.href.split('/')))
        // console.log(page)
        this.setState({
            page: page,
        })
        this.props.onSelectPage(page) 
    }

    render() {
        const pages = []; 
        let i = 1; 
        while(pages.length<this.props.pages){pages.push(i++)}
        
        const currentPage = this.props.page;
        const pagesBlock = pages.map(page=>{
            return <a key={page} className={`page-href ${ currentPage === page ? ' active' : ''}`} href={page} onClick={this.handleClick}>{page}</a>
        })
        return (
            <div>
                {pagesBlock}
            </div>
        )
    }
}

export default Pagination;