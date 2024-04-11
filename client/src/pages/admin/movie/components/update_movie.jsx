import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Dropdown, ListGroup, Row, Col } from 'react-bootstrap';
import movieApi from '../../../../api/modules/movie.api';
import genresApi from '../../../../api/modules/genre.api';
import performersApi from '../../../../api/modules/performer.api';
import { toast } from 'react-toastify';
const UpdateMovie = ({ show, onHide, movie }) => {
    const [formData, setFormData] = useState({
        mediaType: '',
        mediaTitle: '',
        mediaDecription: '',
        mediaRate: '',
        mediaYear: '',
        mediaOfViewmediaRate: '',
        mediaLinkPoster: '',
        mediaLinkTrailer: '',
        mediaLinkEnbale: '',
        episodes: [],
        genres: [],
        performers: [],
    });
    const [episodes, setEpisodes] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedPerformers, setSelectedPerformers] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);
    const [performerOptions, setPerformerOptions] = useState([]);
    const [episodeFormData, setEpisodeFormData] = useState({
        title: '',
        episodeNumber: '',
        mediaLinkEnbale: ''
    });

    useEffect(()=>{
        setSelectedGenres([]);
        setSelectedPerformers([]);
        setEpisodes([])
    },[show])

    useEffect(() => {
        async function fetchGenresAndPerformers() {
            try {
                // Fetch dropdown genres
                const genres = await genresApi.getDropDownGenres();
                setGenreOptions(genres);

                // Fetch dropdown performers
                const performers = await performersApi.getDropDownPer();
                setPerformerOptions(performers);

                // Set form data based on the provided movie
                setFormData({
                    mediaType: movie.mediaType || 'movie',
                    mediaTitle: movie.mediaTitle || '',
                    mediaDecription: movie.mediaDecription || '',
                    mediaRate: movie.mediaRate || '',
                    mediaYear: movie.mediaYear || '',
                    mediaOfViewmediaRate: movie.mediaOfViewmediaRate || 0,
                    mediaLinkPoster: movie.mediaLinkPoster || '',
                    mediaLinkTrailer: movie.mediaLinkTrailer || '',
                    mediaLinkEnbale: movie.mediaLinkEnbale || '',
                    episodes: movie.episodes || [],
                    genres: movie.genres || [],
                    performerMovies: [],
                });
                if (movie.episodes.length > 0 && episodes.length === 0) {
                    movie.episodes?.forEach(option => {
                        const data = {
                            title: option.title,
                            episodeNumber: option.episodeNumber,
                            mediaLinkEnbale: option.mediaLinkEnbale
                        }
                        if (episodes.filter(item => item.episodeNumber == option.episodeNumber).length === 0) {
                            setEpisodes(pre => [...pre, data]);
                        }
                    })
                }
                movie.genres?.forEach(option => {
                    const gen = genres.filter(item => item.value === option);
                    const check = selectedGenres.filter(item => item.value === option);
                    if (gen.length > 0 && check.length === 0) {
                        setSelectedGenres(prevGenres => [...prevGenres, gen[0]]);
                    }
                });

                movie.performer?.forEach(option => {
                    const per = performers.filter(item => item.value === option.performer);
                    const check = selectedPerformers.filter(item => item.value === option);
                    if (per.length > 0 && check.length === 0) {
                        const data = {
                            'description': option.perMoDescription,
                            'label': per[0].label,
                            'value': per[0].value,
                        };
                        setSelectedPerformers(prevPerformers => [...prevPerformers, data]);
                    }
                });
            } catch (error) {
                console.error('Error fetching genre and performer options:', error);
            }
        }

        fetchGenresAndPerformers();
    }, [movie]);
    const handleUpdateMovie = async () => {
        try {
            const performersWithDesc = selectedPerformers.map(performer => ({
                performer: performer.value,
                perMoDescription: performer.description
            }));
            await movieApi.updateMovie(movie.id, {
                ...formData,
                genres: selectedGenres.map(genre => genre.value),
                performerMovies: performersWithDesc,
                episodes: episodes
            });
            onHide();
            toast.success('Movie updated successfully');
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    };

    const handleGenreSelect = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(prevGenres => prevGenres.filter(item => item !== genre));
        } else {
            setSelectedGenres(prevGenres => [...prevGenres, genre]);
        }
    };

    const handlePerformerSelect = (performer) => {
        if (!selectedPerformers.find(p => p.value === performer.value)) {
            setSelectedPerformers(prevPerformers => [...prevPerformers, performer]);
        }

    };

    const handleRemovePerformer = (performerToRemove) => {
        setSelectedPerformers(prevPerformers =>
            prevPerformers.filter(p => p.value !== performerToRemove.value)
        );
    };

    const clearAllGenres = () => {
        setSelectedGenres([]);
    };

    const handleAddEpisode = () => {
        setEpisodes([...episodes, episodeFormData]);
        setEpisodeFormData({ title: '', episodeNumber: '', mediaLinkEnbale: '' });
    };

    const removeEpisode = (index) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes.splice(index, 1);
        setEpisodes(updatedEpisodes);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title>Update Movie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Media Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="mediaType"
                            value={formData.mediaType}
                            onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                        >
                            <option value="tv">tv</option>
                            <option value="movie">movie</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Media Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter media title"
                            value={formData.mediaTitle}
                            onChange={(e) => setFormData({ ...formData, mediaTitle: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Media Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter media description"
                            value={formData.mediaDecription}
                            onChange={(e) => setFormData({ ...formData, mediaDescription: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Media Rate</Form.Label>
                        <Form.Control
                            type="number"
                            step="any"
                            placeholder="Enter media rate"
                            value={formData.mediaRate}
                            onChange={(e) => setFormData({ ...formData, mediaRate: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Media Year</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter media year"
                            value={formData.mediaYear}
                            onChange={(e) => setFormData({ ...formData, mediaYear: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Media View Rate</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter media view rate"
                            value={formData.mediaOfViewmediaRate}
                            onChange={(e) => setFormData({ ...formData, mediaOfViewmediaRate: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Media Link Poster</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter media link poster"
                            value={formData.mediaLinkPoster}
                            onChange={(e) => setFormData({ ...formData, mediaLinkPoster: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Media Link trailer</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter media link trailer"
                            value={formData.mediaLinkTrailer}
                            onChange={(e) => setFormData({ ...formData, mediaLinkTrailer: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Media Link Enable</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter media link enable"
                            value={formData.mediaLinkEnbale}
                            onChange={(e) => setFormData({ ...formData, mediaLinkEnbale: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Label>Choose movie Genre</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Select Genres
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {genreOptions.map((option) => (
                                <Dropdown.Item key={option.value} onClick={() => handleGenreSelect(option)}>
                                    {option.label}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* Display selected genres */}
                    <div className="selected-genres d-flex flex-wrap m-3">
                        {selectedGenres.map((genre) => (
                            <span key={genre.value} className="selected-genre me-2 mb-2">
                                {genre.label}
                                <Button variant="link" onClick={() => setSelectedGenres(selectedGenres.filter(item => item !== genre))}>x</Button>
                            </span>
                        ))}
                        {selectedGenres.length > 0 && (
                            <Button variant="outline-danger" onClick={clearAllGenres}>Clear All</Button>
                        )}
                    </div>
                    {/* Dropdown for selecting performers */}
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-performers">
                            Select Performers
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {performerOptions.map((performer) => (
                                <Dropdown.Item key={performer.value} onClick={() => handlePerformerSelect(performer)}>
                                    {performer.label}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="selected-performers-container">
                        {selectedPerformers.map((performer) => (
                            <Form style={{ marginTop: 10 }}>
                                <span>{performer.label}</span>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Control
                                        as="textarea" rows={3}
                                        placeholder="Enter performer description"
                                        value={performer.description || ''}
                                        onChange={(e) => {
                                            const updatedPerformers = selectedPerformers.map(p => {
                                                if (p.value === performer.value) {
                                                    return {
                                                        ...p,
                                                        description: e.target.value
                                                    };
                                                }
                                                return p;
                                            });
                                            setSelectedPerformers(updatedPerformers);
                                        }}
                                    />
                                </Form.Group>
                                <Button variant="danger" size="sm" onClick={() => handleRemovePerformer(performer)}>Delete</Button>
                            </Form>
                        ))}
                    </div>
                    <div className="add-episode-container mt-3 mb-3">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Episode Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter episode title"
                                    value={episodeFormData.title}
                                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, title: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Episode Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter episode number"
                                    value={episodeFormData.episodeNumber}
                                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, episodeNumber: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Episode Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter episode link"
                                    value={episodeFormData.mediaLinkEnbale}
                                    onChange={(e) => setEpisodeFormData({ ...episodeFormData, mediaLinkEnbale: e.target.value })}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleAddEpisode}>Add Episode</Button>
                        </Form>
                    </div>

                    {/* Display added episodes */}
                    <div className="mb-3">
                        <h5>Added Episodes:</h5>
                        <ListGroup>
                            {episodes.map((episode, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col xs={8}>
                                            <Form>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm="2">Title</Form.Label>
                                                    <Col sm="10">
                                                        <Form.Control value={episode.title} disabled />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm="2">Number</Form.Label>
                                                    <Col sm="10">
                                                        <Form.Control value={episode.episodeNumber} disabled />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Form.Label column sm="2">link</Form.Label>
                                                    <Col sm="10">
                                                        <Form.Control as="textarea" rows={3} value={episode.mediaLinkEnbale} disabled />
                                                    </Col>
                                                </Form.Group>
                                            </Form>

                                        </Col>
                                        <Col xs={4}>
                                            <Button variant="danger ml-3" type='button' onClick={() => removeEpisode(index)}>Danger</Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleUpdateMovie}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateMovie;
