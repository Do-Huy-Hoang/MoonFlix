import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AddGerne = (props) => {
    const [genreTitle, setGenreTitle] = useState('');

    const handleChange = (event) => {
        setGenreTitle(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await props.createGenre(genreTitle);
            if (response?.err) {
                toast.error(response.err.message);
            } else {
                toast.success("Genre added successfully.");
                props.onHide();
                // Update the list of genres in the parent component
                props.updateGenres();
            }
        } catch (error) {
            console.error("Error creating genre:", error);
            toast.error("An error occurred while creating the genre.");
        }
    };
    


    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Add Genre
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicGenre">
                    <Form.Label>Genre Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter genre title"
                        name="genreTitle"
                        value={genreTitle}
                        onChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                        Enter the title of the genre you want to add.
                    </Form.Text>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
                Create
            </Button>
        </Modal.Footer>
    </Modal>
    );
}

export default AddGerne