import * as React from 'react';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';
import LabelIcon from '@material-ui/icons/Label';
import { useMediaQuery } from '@material-ui/core';
import { DashboardMenuItem, MenuItemLink } from 'react-admin';
import PersonIcon from '@material-ui/icons/Person';
import SubMenu from "./../layout/SubMenu";
import ReceiptIcon from '@material-ui/icons/Receipt';

import BookmarksIcon from '@material-ui/icons/Bookmarks';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import QueueIcon from '@material-ui/icons/Queue';
const Menu = ({ onMenuClick, dense, logout }) => {
    const [state, setState] = useState({
        menuCatalog: false,
        menuSales: false,
        menuCustomers: false,
        menuInventary:false
    });
    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state) => state.admin.ui.sidebarOpen);
    useSelector((state) => state.theme); // force rerender on theme change

    const handleToggle = (menu) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    return (
        <div>
            {' '}
            <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />
            <SubMenu

                handleToggle={() => handleToggle('menuCustomers')}
                isOpen={state.menuCustomers}
                sidebarIsOpen={open}
                name="Clientes"
                icon={<PersonIcon/>}
                dense={dense}
            >
                <MenuItemLink
                    to={`/clientes`}
                    primaryText={"Clientes"}
                    leftIcon={<PersonIcon/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />
                {/*<MenuItemLink
                    to={`/tipo-clientes`}
                    primaryText={"Tipo de Clientes"}
                    leftIcon={<LabelIcon />}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />*/}
            </SubMenu>



            <SubMenu
                handleToggle={() => handleToggle('menuCatalog')}
                isOpen={state.menuCatalog}
                sidebarIsOpen={open}
                name={"Productos"}
                dense={dense}
                icon={<CollectionsBookmarkIcon/>}
            >
                <MenuItemLink
                    to={"/productos"}
                    primaryText={"Productos"}
                    sidebarIsOpen={open}
                    dense={dense}
                    onClick={onMenuClick}
                    leftIcon={<CollectionsBookmarkIcon/>}
                />
                <MenuItemLink
                    to={"/categorias"}
                    primaryText={"Categorias"}
                    sidebarIsOpen={open}
                    dense={dense}
                    onClick={onMenuClick}
                    leftIcon={<BookmarksIcon/>}
                />

                <MenuItemLink
                    to={"/subcategorias"}
                    primaryText={"Subcategorias"}
                    sidebarIsOpen={open}
                    dense={dense}
                    onClick={onMenuClick}
                    leftIcon={<BookmarksIcon/>}
                />

            </SubMenu>

            <SubMenu

                handleToggle={() => handleToggle('menuInventary')}
                isOpen={state.menuInventary}
                sidebarIsOpen={open}
                name={"Inventario"}
                dense={dense}
                icon={<QueueIcon/>}
            >
                <MenuItemLink
                    to="/inventario"
                    primaryText={"Inventario"}
                    leftIcon={<QueueIcon />}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />

                <MenuItemLink
                    to="/categorias-inventario"
                    primaryText={"Categorias"}
                    leftIcon={<BookmarksIcon/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />
            </SubMenu>

            <MenuItemLink
                to={`/recetario`}
                primaryText={"Recetario"}
                leftIcon={<ReceiptIcon/>}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
            {isXSmall && (
                <MenuItemLink
                    to="/configuration"
                    primaryText={"Configuración"}
                    leftIcon={<SettingsIcon />}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />
            )}
            {isXSmall && logout}
        </div>
    );
};

export default Menu;