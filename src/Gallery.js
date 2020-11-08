import React from 'react';
import Modal from './Modal';
import './Gallery.css';

const urls = {
    getImages: () => `https://boiling-refuge-66454.herokuapp.com/images`,
    getLargeImageAndComments: (imageId) => `https://boiling-refuge-66454.herokuapp.com/images/${imageId}`,
    postComment: (imageId) => `https://boiling-refuge-66454.herokuapp.com/images/${imageId}/comments`
}

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images : [],
            current: {},
            showModal: false
        };
        this.handleModal = this.handleModal.bind(this);
    }
    async handleModal(e) {
        await fetch(urls.getLargeImageAndComments(e.target.id))
            .then(response => response.json())
            .then(data => {
                this.setState(state => {
                    return {
                        current: data,
                        showModal: !state.showModal
                    }
                });
            })
    }
    async getImages() {
        await fetch(urls.getImages())
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({
                    images: data
                });
            });
    }
    componentDidMount() {
        const promise = this.getImages();
    }
    render() {
        const images = this.state.images.map((img) => (<a href="#" key={img.id}><img className="gallery__image" id={img.id} src={img.url} alt={img.id} onClick={this.handleModal} /></a>))
        return (
            <div className="gallery">
                {images}<br />
                {this.state.showModal && <Modal key={this.state.current.id} current={this.state.current} handleModal={this.handleModal} urls={urls}></Modal>}
            </div>
        );
    }
}

export default Gallery;