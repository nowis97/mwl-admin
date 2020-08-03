import React from "react";
import Menu from "../pages/Menu";
import {Layout} from 'react-admin';

const CustomLayout  = (props) => <Layout {...props} menu={Menu} />;

export default CustomLayout;
