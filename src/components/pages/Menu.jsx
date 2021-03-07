import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';
import { useMediaQuery } from '@material-ui/core';
import {DashboardMenuItem, MenuItemLink, usePermissions} from 'react-admin';
import PersonIcon from '@material-ui/icons/Person';
import SubMenu from "./../layout/SubMenu";
import ReceiptIcon from '@material-ui/icons/Receipt';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import QueueIcon from '@material-ui/icons/Queue';
import CropFreeIcon from '@material-ui/icons/CropFree';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import {Factory,StickerCircleOutline,FormatListText} from 'mdi-material-ui';
import GroupIcon from '@material-ui/icons/Group';

const Menu = ({ onMenuClick, dense, logout,...props }) => {
    const [state, setState] = useState({
        menuCatalog: false,
        menuSales: false,
        menuCustomers: false,
        menuInventary:false,
        menuProduction:false,
        menuOrders:false,
        menuStickers:false,
        menuAdmUsers:false
    });

    const {loaded,permissions} = usePermissions();

    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state) => state.admin.ui.sidebarOpen);
    useSelector((state) => state.theme); // force rerender on theme change

    const handleToggle = (menu) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    const getAllPermisionsResources = () =>{
        return permissions.map(obj => obj.permisosRecursos).flat();
    }


    if (!loaded) return null



    return (
        <div>
            {' '}
            {/*<DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />*/}
            <SubMenu
                handleToggle={() => handleToggle('menuOrders')}
                isOpen={state.menuOrders}
                sidebarIsOpen={open}
                name={"Pedidos"}
                icon={<ShoppingBasketIcon/>}
                dense={dense}
            >
                <MenuItemLink
                    to={`/pedidos`}
                    primaryText={"Pedidos"}
                    leftIcon={<ShoppingBasketIcon/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />

                <MenuItemLink
                    to={`/cambiar-estado`}
                    primaryText={"Cambiar estado"}
                    leftIcon={<CropFreeIcon/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />
            </SubMenu>


            <MenuItemLink
                to={`/clientes`}
                primaryText={"Clientes"}
                leftIcon={<PersonIcon/>}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />



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

            <SubMenu
                handleToggle={() => handleToggle('menuProduction')}
                isOpen={state.menuProduction}
                sidebarIsOpen={open}
                name={"Producción"}
                dense={dense}
                icon={<Factory/>}>
                <MenuItemLink
                    to={'/producciones'}
                    primaryText={"Produccion"}
                    leftIcon={<Factory/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}

                />

                <MenuItemLink
                    to={'/etiquetas'}
                    primaryText={'Etiquetas'}
                    leftIcon={<StickerCircleOutline/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />

            </SubMenu>

            <MenuItemLink
                to={'/delivery'}
                primaryText={'Delivery'}
                leftIcon={<LocalShippingIcon/>}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />

            <MenuItemLink
                to={`/recetario`}
                primaryText={"Recetario"}
                leftIcon={<ReceiptIcon/>}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />

            <SubMenu
                handleToggle={() => handleToggle('menuAdmUsers')}
                isOpen={state.menuAdmUsers}
                sidebarIsOpen={open}
                name={"Adm. Acceso"}
                icon={<PersonIcon/>}
                dense={dense}
            >
                <MenuItemLink
                    to={'/usuarios'}
                    primaryText={"Usuarios"}
                    leftIcon={<PersonIcon/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />

                <MenuItemLink
                    to={'/roles'}
                    primaryText={"Roles"}
                    leftIcon={<GroupIcon/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                    />

                <MenuItemLink
                    to={'/recursos'}
                    primaryText={"Recursos"}
                    leftIcon={<FormatListText/>}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />

            </SubMenu>


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
