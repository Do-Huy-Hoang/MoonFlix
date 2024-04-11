import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UpdateGenres = ({ show, onHide, onUpdate, genre }) => {
    const [updatedTitle, setUpdatedTitle] = useState('');

    const handleUpdate = () => {
        onUpdate(updatedTitle);
    };

    useEffect(() => {
        if (genre) {
            setUpdatedTitle(genre.genresTitle);
        }
    }, [genre]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Genre</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formGenreTitle">
                    <Form.Label>Genre Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter genre title"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateGenres