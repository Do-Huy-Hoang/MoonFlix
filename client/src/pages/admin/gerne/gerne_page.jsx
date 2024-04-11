import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { React, useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import AddGerne from './components/add_gerne'
import '../../../assets/scss/admin/Admin.scss'
import gerneApi from '../../../api/modules/genre.api'
import { toast } from "react-toastify";
import DeleteGenres from './components/delete_genres'
import UpdateGenres from './components/update_genres'
import DataTable from 'react-data-table-component';


const GernePage = () => {
    const [createShow, setCreateShow] = useState(false);
    const [gernes, setGernes] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [deleteShow, setDeleteShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);


    const getGerne = async () => {
        const { response, err } = await gerneApi.getList();
        if (response) {
            setGernes(response);
        }
        if (err) {
            toast.error(err.message);
        }
    };
    const updateGenres = async () => {
        const { response, err } = await gerneApi.getList();
        if (response) {
            setGernes(response);
        }
        if (err) {
            toast.error(err.message);
        }
    };
    useEffect(() => {

        getGerne();
    }, []);

    const handleDeleteClick = (genre) => {
        setSelectedGenre(genre);
        setDeleteShow(true);
    };

    const handleDelete = async () => {
        try {
            const response = await gerneApi.deleteGenre(selectedGenre.id);
            if (response?.err) {
                toast.error(response.err.message);
            } else {
                toast.success("Genre deleted successfully.");
                setDeleteShow(false); // Hide the delete modal
                getGerne(); // Refresh the genre list
            }
        } catch (error) {
            console.error("Error deleting genre:", error);
            toast.error("An error occurred while deleting the genre.");
        }
    };

    const handleUpdateClick = (genre) => {
        setSelectedGenre(genre);
        setUpdateShow(true);
    };

    const handleUpdate = async (updatedTitle) => {
        try {
            const response = await gerneApi.updateGenre(selectedGenre.id, updatedTitle);
            if (response?.err) {
                toast.error(response.err.message);
            } else {
                toast.success("Genre updated successfully.");
                setUpdateShow(false); // Hide the update modal
                getGerne(); // Refresh the genre list
            }
        } catch (error) {
            console.error("Error updating genre:", error);
            toast.error("An error occurred while updating the genre.");
        }
    };

    const columns = [
        {
            name: '#',
            selector: row => row.Id,
            width: '20%',
        },
        {
            name: 'Title',
            selector: row => row.Title,
            width: '35%',
        },
        {
            name: 'Function',
            selector: row => row.Function,
            width: '45%',
        }
    ];

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };

    useEffect(() => {
        const data = [];
        gernes.forEach(gerne => {
            data.push({
                Id: gerne.id,
                Title: gerne.genresTitle,
                Function:
                    <>
                        <Button variant="success" onClick={() => handleUpdateClick(gerne)}>
                            Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteClick(gerne)}>
                            Delete
                        </Button>
                    </>,
            });
        })
        setDataTable(data);
        console.log(dataTable)
    }, [gernes]);
    useEffect(() => {
        setFilteredItems(dataTable.filter(item => item.Title && item.Title.toLowerCase().includes(filterText.toLowerCase())));
    }, [filterText, dataTable]);


    return (
        <>
            <>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">Gernes</h1>
                    </div>
                    <Row style={{ marginBottom: 10 }}>
                        <Col lg={4} xs={12}>
                            <div className="button">
                                <Button variant="success" className="btn-add" onClick={() => setCreateShow(true)}>Add Gerne</Button>
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
                            <li className="nav-item dropdown no-arrow d-sm-none">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="!#"
                                    id="searchDropdown"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <FontAwesomeIcon icon={["fas", "search"]} size="lg" />
                                </a>
                                {/* Dropdown - Messages */}
                                <div
                                    className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                    aria-labelledby="searchDropdown"
                                >
                                    <form className="form-inline mr-auto w-100 navbar-search">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control bg-light border-0 small"
                                                placeholder="Search for..."
                                                aria-label="Search"
                                                aria-describedby="basic-addon2"
                                            />
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button">
                                                    <FontAwesomeIcon icon={["fas", "search"]} size="lg" />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </li>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12} md={12} lg={12}>
                            <div className="card shadow mb-4">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <AddGerne
                                            show={createShow}
                                            onHide={() => setCreateShow(false)}
                                            createGenre={gerneApi.createGenre}
                                            updateGenres={updateGenres} // Pass updateGenres function as a prop
                                        />
                                        <DeleteGenres
                                            show={deleteShow}
                                            onHide={() => setDeleteShow(false)}
                                            onDelete={(genreId) => handleDelete(genreId)} // Pass genreId to handleDelete function
                                            genre={selectedGenre}
                                        />

                                        <UpdateGenres
                                            show={updateShow}
                                            onHide={() => setUpdateShow(false)}
                                            onUpdate={handleUpdate}
                                            genre={selectedGenre}
                                            paginationResetDefaultPage={resetPaginationToggle}
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
            </>
        </>
    )
}

export default GernePage