import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import "../../../assets/scss/admin/Headbar.scss"

const Headbar = () => {
  return (
    <>

      {/* Topbar */}
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        {/* Sidebar Toggle (Topbar) */}
        <button
          id="sidebarToggleTop"
          className="btn btn-link d-md-none rounded-circle mr-3"
        >
          <i className="fa fa-bars" />
        </button>
      </nav>
      {/* End of Topbar */}

    </>
  )
}

export default Headbar
