import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const UpdatePerformer = ({ show, onHide, onUpdate, performer }) => {
    const [updatedPerformerData, setUpdatedPerformerData] = useState({
        perName: '',
        perYear: '',
        perAvatar: performer ? performer.perAvatar : null 
    });

    useEffect(() => {
        if (performer) {
            setUpdatedPerformerData({
                perName: performer.perName,
                perYear: performer.perYear,
                perAvatar: performer.perAvatar 
            });
        }
    }, [performer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPerformerData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(updatedPerformerData);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setUpdatedPerformerData(prevData => ({
                ...prevData,
                perAvatar: reader.result.split(',')[1] 
            }));
        };
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Performer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formPerName">
                        <Form.Label>Performer Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="perName"
                            value={updatedPerformerData.perName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPerYear">
                        <Form.Label>Performer Year</Form.Label>
                        <Form.Control
                            type="text"
                            name="perYear"
                            value={updatedPerformerData.perYear}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <img src={`data:image/jpeg;base64,${updatedPerformerData.perAvatar}`} alt="Performer Avatar" />
                    <Form.Group controlId="formPerAvatar">
                        <Form.Label>Performer Avatar</Form.Label>      
                        <Form.Control
                            type="file"
                            name="perAvatar"
                            onChange={handleAvatarChange}
                            accept="image/*"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdatePerformer;
