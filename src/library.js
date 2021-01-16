'use strict';

function DeleteBtn(props){
    return(
        <button
            className="delBtn"
            onClick={()=>props.onClick()}
        >
            DELETE
        </button>
    );
}

function ReadBtn(props){
    let renderClass;
    props.read? renderClass = "read" : renderClass= "notRead";
    return(
        <div
        className = {renderClass}
        onClick = {props.onClick}
        >    
        </div>
    );
}


// class ReadBtn extends React.Component{
//     constructor(props){
//         super(props);
//         this.handleClick = this.handleClick.bind(this);
//     }

//     handleClick(event){
//         var clickClass = event.target.className;
//         console.log(clickClass);
//         // clickClass == "read"? clickClass = "notRead": clickClass = "read";
//         // console.log(clickClass);
//         // console.log(this.props.read);
//         (event)=>this.props.onClick(event);
//     }

//     render(){
//         let renderClass;
//         this.props.read? renderClass = "read" : renderClass= "notRead";
//         // if(clickClass) renderClass = clickClass;
//         return(
//             <div
//                 className = {renderClass}
//                 onClick = {this.onClick}
//             >    
//             </div>
//         )
//     }
// }


class BookInput extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.props.onInputChange(event);
    }

    handleSubmit(event){
        this.props.onFormSubmit(event);
        event.preventDefault();
    }

    render(){
        return(
            <form id="inputs">
            <h2>Add a book manually:</h2>
                <label>
                    Title:
                    <input 
                    name="title" 
                    type="text" 
                    id="title" 
                    value={this.props.title}
                    onChange={this.handleChange}
                    />
                </label>
                <label>
                    Author:
                    <input name="author" 
                    type="text" 
                    id="author" 
                    value={this.props.author}
                    onChange={this.handleChange}    
                    />
                </label>
                <label>
                    Pages:
                    <input name="pages" 
                    type="text" 
                    id="pages" 
                    value={this.props.pages}
                    onChange={this.handleChange}
                    />
                </label>
                <label>
                    Cover URL:
                    <input name="cover" 
                    type="text" 
                    id="cover" 
                    value={this.props.cover}
                    onChange={this.handleChange}
                    />
                </label>
                <label>
                    Read?
                    <input 
                    name="read" 
                    type="checkbox" 
                    id="read"
                    checked={this.props.read}
                    onChange={this.handleChange}
                    />
                </label>
                <button 
                type="button" 
                id = "btn"
                onClick={this.handleSubmit}
                >
                    Add Book
                </button>
            </form>
        );
    }
}

class Book extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        let read;
        let defaultBG = "https://cdn.hipwallpaper.com/i/7/96/AKf6Qb.jpg";
        let background;
        this.props.book.cover? background = this.props.book.cover: background = defaultBG;
        this.props.book.read? read = "READ": read = 'NOT READ';
        return(
            <div className="aBookWrapper" style={{backgroundImage:`url(${background})`}}>
            <div className="aBook">
                <p className="title">{this.props.book.title}</p>
                <p className="author">{this.props.book.author}</p>
                <p className="pages">{this.props.book.pages + " Pages"}</p>
                {/* <p className="readBtn">{read}</p> */}
                <ReadBtn
                    read = {this.props.book.read}
                    onClick={(e)=>this.props.readToggle(e)} 
                />
                {/* <div className="unreadIcon"></div> */}
                <DeleteBtn
                    onClick={() => this.props.handleDel(event)}
                />
            </div>
            </div>
        );
    }
}

function BookContainer(props){
    const books = props.books;
    return(
        <div className="books">
            {books.map(book => <Book 
            handleDel={() => props.handleDel(event)}
            readToggle={(e) => props.readToggle(e)} 
            key={book.title} 
            book={book} 
                /> 
            )}
        </div>
    );
}

class Library extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: "Dune",
            author: "Frank Herbert",
            pages: 604,
            cover: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1555447414l/44767458.jpg",
            read: false,
            search:"Oathbringer",
            books:[
                {title:"Foundation", author:"Isaac Asimov", pages:244, read:true, cover: "https://i.pinimg.com/originals/c6/6e/bc/c66ebc177446badebed65a0d80c45a64.jpg"},
                {title:"The Way of Kings", author:"Brandon Sanderson", pages:1007, read:true, cover: "https://prodimage.images-bn.com/pimages/9780765376671_p0_v5_s1200x630.jpg"},
                {title:"A Storm of Swords", author:"George R. R. Martin", pages:992, read:true, cover: "https://images-na.ssl-images-amazon.com/images/I/91-KBK-9K2L.jpg"}
            ],
            readSearch: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.searchBook = this.searchBook.bind(this);
        this.readToggle = this.readToggle.bind(this);
    }
    
    componentDidMount(){
        // localStorage.removeItem('library');
        let library = JSON.parse(localStorage.getItem('library'));
        if(library) this.setState({books: library});
    }

    handleChange(event){
        const target = event.target;
        const value = target.name === "read" || target.name === "readSearch" ? target.checked: target.value;
        // const value = target.name === "readSearch"? target.checked: target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event){
        const newBooks = this.state.books;
        const index = newBooks.map((book) => {return book.title}).indexOf(this.state.title);
        if(index == -1){
            this.setState({
                books: newBooks.concat([{
                    title:this.state.title,
                    author:this.state.author,
                    pages:this.state.pages,
                    cover:this.state.cover,
                    read:this.state.read
                }]),
                title:"",
                author:"",
                pages:"",
                cover:"",
                read:""
            }, () => {
                // console.table(this.state.books);
                localStorage.setItem('library', JSON.stringify(this.state.books));
            });
        }else{
            this.setState({
                title:"",
                author:"",
                pages:"",
                cover:"",
                read:""
            });
            alert("That book is already on your library!");
        }
        event.preventDefault();
    }

    handleDel(event){
        const target = event.target.parentElement;
        const title = target.querySelector(".title").innerHTML;
        const newBooks = this.state.books;
        const index = newBooks.map((book) => {return book.title}).indexOf(title);
        newBooks.splice(index,1);
        this.setState({
            books:newBooks
        }, ()=>{
            localStorage.setItem('library', JSON.stringify(this.state.books));
        });
    }

    searchBook(event){
        event.persist()
        let query = this.state.search;
        fetch("https://www.googleapis.com/books/v1/volumes?q="+query)
        .then((res)=>{
            return res.json()
        }).then((result)=>{
            // console.log(result.items[0].volumeInfo.title);
            const title = result.items[0].volumeInfo.title;
            const newBooks = this.state.books;
            const index = newBooks.map((book) => {return book.title}).indexOf(title);
            // console.log(this.state.readSearch);
            if(index == -1){
                this.setState({
                    title: result.items[0].volumeInfo.title,
                    author: result.items[0].volumeInfo.authors[0],
                    pages: result.items[0].volumeInfo.pageCount,
                    cover: result.items[0].volumeInfo.imageLinks.smallThumbnail,
                    read: this.state.readSearch
                });
                this.handleSubmit(event);
            }else{
                alert("That book is already on your library!");
            }
    })
        this.setState({search:""});
        event.preventDefault();
    }

    readToggle(event){
        console.log(event.target.parentElement);
        const target = event.target.parentElement;
        const title = target.querySelector(".title").innerHTML;
        const newBooks = this.state.books;
        const index = newBooks.map((book) => {return book.title}).indexOf(title);
        newBooks[index].read = !newBooks[index].read;
        // console.log(newBooks[index].read);
        this.setState({
            books:newBooks
        }, ()=>{
            localStorage.setItem('library', JSON.stringify(this.state.books));
        });
    }

    render(){
        const values = {
            title: this.state.title,
            author: this.state.author,
            pages: this.state.pages,
            cover: this.state.cover,
            read: this.state.read,
        }
        return(
            <div>
                <BookContainer
                    handleDel={this.handleDel} 
                    readToggle={this.readToggle} 
                    books = {this.state.books}
                />
                <div id="searchBars">
                    <BookInput
                        onInputChange ={this.handleChange}
                        onFormSubmit={this.handleSubmit}
                        {...values}
                    />
                    <p id="or">OR</p>
                    <BookSearch
                        onInputChange ={this.handleChange}
                        onFormSubmit={this.searchBook}
                        search = {this.state.search}
                    />
                </div>
            </div>
        );
    }
}

class BookSearch extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.props.onInputChange(event);
    }

    handleSubmit(event){
        this.props.onFormSubmit(event);
        event.preventDefault();
    }

    render(){
        return(
            <form id="inputs" onSubmit={e => { e.preventDefault(); }}>
            <h2>Search in Google Books:</h2>
                <label>
                    Search query:
                    <input 
                    name="search" 
                    type="text" 
                    id="search" 
                    value={this.props.search}
                    onChange={this.handleChange}
                    />
                </label>
                <label>
                    Read?
                    <input 
                    name="readSearch" 
                    type="checkbox" 
                    id="readSearch"
                    checked={this.props.read}
                    onChange={this.handleChange}
                    />
                </label>
                <button 
                type="button" 
                id = "btn"
                onClick={this.handleSubmit}
                >
                    Search Book
                </button>
            </form>
        );
    }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<Library/>, domContainer);