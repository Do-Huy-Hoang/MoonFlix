import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Button, Modal } from 'react-bootstrap';

const DeleteGenres = ({ show, onHide, onDelete, genre }) => {

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Genre</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the genre {genre && genre.genresTitle}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    <FontAwesomeIcon icon={['fas', 'trash']} /> Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteGenres