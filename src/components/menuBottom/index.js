import React from "react";
import { Link } from "react-router-dom";
import './menuBottom.css';
import { ImHome } from "react-icons/im";
import { ImCart } from "react-icons/im";
import { FaFileAlt } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { FaConciergeBell } from "react-icons/fa";

function MenuBottom(){
    return(
        <div className="bodyMenuBottom">
           <Link to='/cardapio'><p className="menuBottomHome"><ImHome /></p></Link>
           <Link to='/cardapio'><p><FaFileAlt /></p></Link>
           <Link to='/cardapio'><p><BsClock /></p></Link>
           <Link to='/cardapio'><p><ImCart /></p></Link>
           <Link to='/'><p><FaConciergeBell /></p></Link>
        </div>
    );
} export default MenuBottom;