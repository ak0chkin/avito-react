import React from 'react';
import './Modal.css';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            comment: '',
            current: this.props.current
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
    }
    handleInput(e) {
        switch (e.target.name) {
            case 'name':
                this.setState({ name: e.target.value });
                break;
            case 'comment':
                this.setState({ comment: e.target.value });
                break;
            default:
                break;
        }
    }
    async handleAddComment(e) {
        e.preventDefault();
        const data = {
            name: this.state.name,
            comment: this.state.comment
        }
        await fetch(this.props.urls.postComment(this.props.current.id), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 204)
                return true;
            else
                throw new Error('BadResponseStatus');
        }).then(() => {
            document.getElementById('name').value = '';
            document.getElementById('comment').value = '';
            this.setState(state => ({
                name: '',
                comment: '',
                current: { ...state.current, comments: [...state.current.comments, { date: Date.now(), text: data.comment, id: Date.now() }] }
            }));
        });
    }

    render() {
        const comments = this.state.current.comments.map(item => {
            return (
                <div className="modal__comment" key={item.id}>
                    <p>{new Date(item.date).toLocaleDateString("ru-RU")}</p>
                    <p>{item.text}</p>
                </div>
            );
        });
        return (
            <div className="modal">
                <div className="modal__сontentwrapper">
                    <img className="modal__img" src={this.state.current.url} alt="current img" />
                    <form className="modal__new-comment"  onSubmit={this.handleAddComment}>
                        <input id="name" name="name" type="text" className="modal__new-comment__input" placeholder="Ваше имя" onChange={this.handleInput} required />
                        <input id="comment" name="comment" type="text" className="modal__new-comment__input" placeholder="Ваш комментарий" onChange={this.handleInput} required />
                        <button type="submit" className="modal__new-comment__submit">Оставить комментарий</button>
                    </form>
                    <div className="modal__comments">
                        {comments}
                    </div>
                    <a href="#" className="modal__close-button" onClick={this.props.handleModal}>X</a>
                </div>

            </div>
        );
    }
}

export default Modal;