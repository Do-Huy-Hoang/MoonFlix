import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AddPerformer = (props) => {
    const { createPerformer, onHide } = props;

    const [performerName, setPerformerName] = useState('');
    const [performerYear, setPerformerYear] = useState('');
    const [performerAvatar, setPerformerAvatar] = useState(null);

    useEffect(() => {
        setPerformerName('');
        setPerformerYear('');
        setPerformerAvatar('');
    }, [props]);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'performerName') {
            setPerformerName(value);
        } else if (name === 'performerYear') {
            setPerformerYear(value);
        } else if (name === 'performerAvatar') {
            if (files.length > 0) {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    setPerformerAvatar(reader.result.split(',')[1]);
                };
            }
        }
    };

    const handleSubmit = async () => {
        try {
            if (!performerName || !performerYear || !performerAvatar) {
                toast.error('Please fill in all fields.');
                return;
            }
            const performerData = {
                perName: performerName,
                perYear: performerYear,
                perAvatar: performerAvatar
            };
            await createPerformer(performerData);
            onHide(); 
        } catch (error) {
            console.error("Error handling submit:", error);
            toast.error("An error occurred while processing the form.");
        }
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Add Performer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicPerformerName">
                        <Form.Label>Performer Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter performer name"
                            name="performerName"
                            value={performerName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPerformerYear">
                        <Form.Label>Performer Year</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter performer year"
                            name="performerYear"
                            value={performerYear}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPerformerAvatar">
                        <Form.Label>Performer Avatar</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            name="performerAvatar"
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
                <img src={`data:image/jpeg;base64,${performerAvatar}`} alt="Avatar" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddPerformer;
