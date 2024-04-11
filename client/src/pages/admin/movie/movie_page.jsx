import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import AddMovie from './components/add_movie';
import movieApi from '../../../api/modules/movie.api';
import '../../../assets/scss/admin/Admin.scss'
import { toast } from 'react-toastify';
import DeleteMovie from './components/delete_movie';
import UpdateMovie from './components/update_movie';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MoviePage = () => {
    const [createShow, setCreateShow] = useState(false);
    const [movies, setMovies] = useState([]);
    const [updateShow, setUpdateShow] = useState(false); 
    const [deleteShow, setDeleteShow] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [dataTable, setDataTable] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  

    const getMovies = async () => {
        try {
            const { response, err } = await movieApi.getList();
            if (response) {
                setMovies(response);
            }
            if (err) {
                toast.error(err.message);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
            toast.error('Failed to fetch movies');
        }
    };

    useEffect(() => {
        getMovies();
    }, []);

    const handleCreateClose = () => {
        setCreateShow(false);
        getMovies();
    };

    const handleDeleteClick = (movie) => {
        setSelectedMovie(movie);
        setDeleteShow(true);
    };

    const handleDelete = async () => {
        try {
            const response = await movieApi.deleteMovie(selectedMovie.id);
            if (response?.err) {
                toast.error(response.err.message);
            } else {
                toast.success("Movie deleted successfully.");
                getMovies();
                setDeleteShow(false);
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
            toast.error("An error occurred while deleting the movie.");
        }
    };

    const handleUpdateShow = (movie) => {
        setSelectedMovie(movie); // Set the selected movie for update
        setUpdateShow(true); // Show the update modal
    };

    const handleUpdateClose = () => {
        setUpdateShow(false);
        getMovies();
    };
    console.log(movies)
    const handleUpdateMovie = async (updatedData) => {
        try {
            // Gọi API để cập nhật phim
            await movieApi.updateMovie(selectedMovie.id, updatedData);
            // Cập nhật lại danh sách phim
            getMovies();
            // Đóng modal cập nhật
            setUpdateShow(false);
            // Hiển thị thông báo thành công
            toast.success('Movie updated successfully');
        } catch (error) {
            console.error('Error updating movie:', error);
            toast.error('Failed to update movie');
        }
    };
    const columns = [
        {
          name: '#',
          selector: row => row.Id,
          width: '15%', 
        },
        {
            name: 'Type',
            selector: row => row.Type,
            width: '5%', 
          },
        {
          name: 'Title',
          selector: row => row.Title,
          width: '20%', 
        },
        {
          name: 'Rate',
          selector: row => row.Rate,
          width: '5%', 
        },
        {
          name: 'Year',
          selector: row => row.Year,
          width: '5%', 
        },
        {
          name: 'View',
          selector: row => row.View,
          width: '5%', 
        },
        {
          name: 'Poster',
          selector: row => row.Poster,
          width: '15%', 
        },
        {
          name: 'Function',
          selector: row => row.Function,
          width: '15%', 
        },
      ];
          
      useEffect(() => {
        const data = [];
        movies.forEach(movie => {
            data.push({
                Id: movie.id,
                Type: movie.mediaType,
                Title: movie.mediaTitle,
                Rate: movie.mediaRate,
                Year: movie.mediaYear,
                View: movie.mediaOfViewmediaRate,
                Poster: <img src={movie.mediaLinkPoster} alt="Movie Poster" style={{ maxWidth: '300px', maxHeight: '200px', width: 'auto', height: 'auto' }} />,
                Function:
                    <>
                        <Button variant="success" onClick={() => handleUpdateShow(movie)}>
                            Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteClick(movie)}>
                            Delete
                        </Button>
                    </>,
            });
        })
        setDataTable(data);
    }, [movies]);
    useEffect(() => {
        setFilteredItems(dataTable.filter(item => item.Title && item.Title.toLowerCase().includes(filterText.toLowerCase())));
    }, [filterText,dataTable]);

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Movies</h1>
                </div>
                <Row style={{marginBottom: 10}}>
                        <Col lg={4} xs={12}>
                            <div className="button">
                                <Button variant="success" className="btn-add" onClick={() => setCreateShow(true)}>Add Movie</Button>
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
			                        onChange={(e)=>setFilterText(e.target.value)}
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
                                    <AddMovie
                                        show={createShow}
                                        onHide={handleCreateClose}
                                    // onCreate={handleCreateMovie}
                                    />
                                    <DeleteMovie
                                        show={deleteShow}
                                        onHide={() => setDeleteShow(false)}
                                        onDelete={handleDelete}
                                        movie={selectedMovie}
                                    />
                                    <UpdateMovie
                                        show={updateShow}
                                        onHide={handleUpdateClose}
                                        onUpdate={handleUpdateMovie}
                                        movie={selectedMovie} // Pass the selected movie data to the UpdateMovie component
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
    );
}

export default MoviePage;
