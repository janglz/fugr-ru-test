import React from 'react';

class SearchBar extends React.Component {

    

    render() {
        return (
            <form onSubmit={this.globalSearch}>
                <label>
                    Поиск:
                    <input type="text" name="search" onInput={this.props.searchOnPage} defaultValue={this.props.searchQuery}/>
                </label>
                <input type="submit" value="поиск" />
            </form>
        )
    }
}

export default SearchBar;