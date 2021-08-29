import React from "react";
import Menu from "../pages/Menu";
import {Layout} from 'react-admin';
import MyAppBar from "./MyAppBar";

const CustomLayout  = (props) => <Layout {...props}  menu={Menu} appBar={MyAppBar}  />;

export default CustomLayout;
