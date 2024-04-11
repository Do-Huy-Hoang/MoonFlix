import React, { useEffect, useState } from 'react'
import MoviePage from './movie/movie_page'
import GernePage from './gerne/gerne_page'
import PerformerPage from './performer/performer_page'
import "../../assets/scss/admin/Sidebar.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Headbar from "../../components/common/admin_components/Headbar"
import Footer from "../../components/common/admin_components/Headbar"


const AdminIndex = () => {
    const [Id, setId] = useState(1)
    const [title, setTitle] = useState("Movies")
    const [active, setActive] = useState("")
    const handleSelect = (id) => {
        let collapseOld = document.getElementById('item-' + Id);
        collapseOld.classList.remove('active');
        let collapse = document.getElementById('item-' + id);
        collapse.classList.add('active');
        setId(id);
    }


    useEffect(() => {
        if (Id === 1) {
            setTitle("Movie")
        } else if (Id === 2) {
            setTitle("Gernes")
        } else if (Id === 3) {
            setTitle("Performers")
        }
    }, [Id])
    return (
        <>
            <div id='wrapper'>
                <div className='side '>
                    {/* Sidebar */}
                    <ul
                        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
                        id="accordionSidebar"
                        style={{height: '99%'}}
                    >
                        {/* Sidebar - Brand */}
                        <a
                            className="sidebar-brand d-flex align-items-center justify-content-center"
                            href="#"
                        >
                            <div className="sidebar-brand-icon rotate-n-15">
                                <i className="fas fa-laugh-wink" />
                            </div>
                            <div className="sidebar-brand-text mx-3">
                                Moonflix
                            </div>
                        </a>
                        {/* Divider */}
                        <hr className="sidebar-divider my-0" />
                        {/* Nav Item - Dashboard */}
                        <li className="nav-item">
                            <a href='#!' className="nav-link active" id='item-1' onClick={() => handleSelect(1)}>
                                <span>Movies</span>
                                <FontAwesomeIcon icon={['fas', 'film']} size='lg' />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href='#!' className="nav-link" id='item-2' onClick={() => handleSelect(2)}>
                                <span>Gernes</span>
                                <FontAwesomeIcon icon={['fas', 'search']} size='lg' />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href='#!' className="nav-link" id='item-3' onClick={() => handleSelect(3)}>
                                <span>Perfomers</span>
                                <FontAwesomeIcon icon={['fas', 'user']} size='lg' />
                            </a>
                        </li>
                    </ul>
                    {/* End of Sidebar */}
                </div>
                <div id='content'>
                    <Headbar />
                    {Id === 1 ? <MoviePage /> : ''}
                    {Id === 2 ? <GernePage /> : ''}
                    {Id === 3 ? <PerformerPage /> : ''}
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default AdminIndex