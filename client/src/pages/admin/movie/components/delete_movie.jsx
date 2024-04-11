import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteMovie = ({ show, onHide, onDelete, movie }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Movie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the movie {movie && movie.mediaTitle}?
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
};

export default DeleteMovie;
