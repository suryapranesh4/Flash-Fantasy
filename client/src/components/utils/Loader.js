import React from 'react';
import { TiArrowSync } from "react-icons/ti";

const Loader = () => {
    return (
        <div className="loaderWrapper">
            <TiArrowSync size="50px" className="loader" fill="#f7b42c"/> 
        </div>
    )
}

export default Loader;