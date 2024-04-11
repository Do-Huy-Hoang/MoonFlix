import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import AddPerformer from './components/add_performer';
import performerApi from '../../../api/modules/performer.api';
import { toast } from 'react-toastify';
import DeletePerformer from './components/delete_perfomer';
import UpdatePerformer from './components/update_perfomer'
import DataTable from 'react-data-table-component';

const PerformerPage = () => {
    const [createShow, setCreateShow] = useState(false);
    const [performers, setPerformers] = useState([]);
    const [selectedPerformer, setSelectedPerformer] = useState(null);
    const [deleteShow, setDeleteShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [dataTable, setDataTable] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const getPerformers = async () => {
        try {
            const { response, err } = await performerApi.getList();

            if (response) {
                setPerformers(response);
            }
            if (err) {
                toast.error(err.message);
            }
        } catch (error) {
            console.error('Error fetching performers:', error);
            toast.error('An error occurred while fetching performers.');
        }
    };

    useEffect(() => {
        getPerformers();
    }, []);

    const handleCreatePerformer = async (performerData) => {
        try {
            const performerExists = performers.some(per => per.perName === performerData.perName);

            if (performerExists) {
                toast.error('Performer with the same name already exists.');
            } else {
                const response = await performerApi.createPerformer(performerData);
                toast.success('Performer added successfully.');
                setCreateShow(false);
                getPerformers();
            }
        } catch (error) {
            console.error('Error creating performer:', error);
            toast.error('Failed to create performer.');
        }
    };

    const handleDeleteClick = (performer) => {
        setSelectedPerformer(performer);
        setDeleteShow(true);
    };

    const handleDelete = async () => {
        try {
            const response = await performerApi.deletePerformer(selectedPerformer.id);
            if (response?.err) {
                toast.error(response.err.message);
            } else {
                toast.success("Performer deleted successfully.");
                setDeleteShow(false);
                setPerformers(performers.filter(per => per.id !== selectedPerformer.id));
            }
        } catch (error) {
            console.error("Error deleting Performer:", error);
            toast.error("An error occurred while deleting the Performer.");
        }
    };

    const handleUpdateClick = (performer) => {
        setSelectedPerformer(performer);
        setUpdateShow(true);
    };

    const handleUpdate = async (updatedData) => {
        try {
            const response = await performerApi.updatePerformer(selectedPerformer.id, updatedData);
            if (response?.err) {
                toast.error(response.err.message);
            } else {
                toast.success("Performer updated successfully.");
                setUpdateShow(false);
                getPerformers();
            }
        } catch (error) {
            console.error("Error updating performer:", error);
            toast.error("An error occurred while updating the performer.");
        }
    };

    const columns = [
        {
            name: '#',
            selector: row => row.Id,
            width: '20%',
        },
        {
            name: 'Name',
            selector: row => row.Name,
            width: '20%',
        },
        {
            name: 'Year',
            selector: row => row.Year,
            width: '10%',
        },
        {
            name: 'Image',
            selector: row => row.Image,
            width: '20%',
        },
        {
            name: 'Function',
            selector: row => row.Function,
            width: '15%',
        },
    ];

    useEffect(() => {
        const data = [];
        performers.forEach(performer => {
            data.push({
                Id: performer.id,
                Name: performer.perName,
                Year: performer.perYear,
                Image: <img src={`data:image/jpeg;base64,${performer.perAvatar}`} alt="Avatar" width={150} height={150}/>,
                Function:
                    <>
                        <Button variant="success" onClick={() => handleUpdateClick(performer)}>
                            Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteClick(performer)}>
                            Delete
                        </Button>
                    </>,
            });
        })
        setDataTable(data);
        
    }, [performers]);
    useEffect(() => {
        setFilteredItems(dataTable.filter(item => item.Name && item.Name.toLowerCase().includes(filterText.toLowerCase())));
    }, [filterText, dataTable]);

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };


    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Performers</h1>
            </div>
            <Row style={{ marginBottom: 10 }}>
                <Col lg={4} xs={12}>
                    <div className="button">
                        <Button variant="success" className="btn-add" onClick={() => setCreateShow(true)}>Add Performer</Button>
                    </div>
                </Col>
                <Col lg={8} xs={12}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control search bg-light border-0 small"
                            placeholder="search by Name"
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                        <div className="input-group-append">
                            <Button variant="dark" onClick={handleClear}>
                                <FontAwesomeIcon icon={["fas", "search"]} size="lg" />
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xl={12} md={12} lg={12}>
                    <div className="card shadow mb-4">
                        <div className="card-body">
                            <div className="table-responsive">
                                <AddPerformer
                                    show={createShow}
                                    onHide={() => setCreateShow(false)}
                                    createPerformer={handleCreatePerformer}
                                />
                                <DeletePerformer
                                    show={deleteShow}
                                    onHide={() => setDeleteShow(false)}
                                    onDelete={handleDelete}
                                    performer={selectedPerformer}
                                />
                                <UpdatePerformer
                                    show={updateShow}
                                    onHide={() => setUpdateShow(false)}
                                    onUpdate={handleUpdate}
                                    performer={selectedPerformer}
                                />
                                <DataTable
                                    columns={columns}
                                    data={filteredItems}
                                    pagination
                                    paginationResetDefaultPage={resetPaginationToggle}
                                    highlightOnHover
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default PerformerPage;
