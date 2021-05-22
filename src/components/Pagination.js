import React from 'react';

class Pagination extends React.Component {

    handleClick = async (e) => {
        const page = Number (e.target.getAttribute('value'))
        await this.props.onSelectPage(page) 
        e.preventDefault();
        e.stopPropagation();
        
    }

    render() {
        const pages = []; 
        let i = 1; 
        while(pages.length<this.props.pages){pages.push(i++)}
        
        const currentPage = this.props.page;
        const pagesBlock = pages.map(page=>{
            return <a key={page} value={page} className={`page-href ${ currentPage === page ? ' active' : ''}`} href={page} onClick={this.handleClick}>{page}</a>
        })
        return (
            <div>
                {pagesBlock}
            </div>
        )
    }
}

export default Pagination;