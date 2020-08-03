import React from 'react';
import './App.css';


import {Admin,Resource} from "react-admin";
import CustomLayout from "./components/layout/CustomLayout";
import {CreateCliente} from "./components/Resources/Clientes/CreateCliente";
import {EditCliente} from "./components/Resources/Clientes/EditCliente";
import {ListGuesser} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import spanishMessages from '@blackbox-vision/ra-language-spanish';
import CreateCategoria from './components/Resources/Categorias/CreateCategoria';
import EditCategoria from './components/Resources/Categorias/EditCategoria';
import {CreateInventario} from "./components/Resources/Inventario/CreateInventario";
import EditInventario from "./components/Resources/Inventario/EditInventario";
import CreateSubcategoria from './components/Resources/Subcategorias/CreateSubcategoria';
import ProductCreate from "./components/Resources/Productos/ProductCreate";
import ProductList from "./components/Resources/Productos/ProductList";
import {myDataProvider} from "./services/customDataProvider";
import { ListCategoria} from "./components/Resources/Categorias/ListCategoria";
import CreateRecetario from "./components/Resources/Recetario/CreateRecetario";
import EditRecetario from "./components/Resources/Recetario/EditRecetario";
import ListRecetario from './components/Resources/Recetario/ListRecetario'
import CategoriaInventarioCreate from "./components/Resources/Inventario/CategoriaInventarioCreate";
import CategoriaInventarioEdit from "./components/Resources/Inventario/CategoriaInventarioEdit";
import {CategoriaInventarioList} from "./components/Resources/Inventario/CategoriaInventarioList";
import {ListInventario} from "./components/Resources/Inventario/ListInventario";
import EditSubcategoria from "./components/Resources/Subcategorias/EditSubcategorias";
import {Login} from './components/layout/Login';
import authProvider from "./services/authProvider";
import ProductEdit from "./components/Resources/Productos/ProductEdit";

const i18nProvider = polyglotI18nProvider(() => spanishMessages, 'es');

function App() {
  return (
    <Admin
        dataProvider ={myDataProvider}
        i18nProvider={i18nProvider}
        layout={CustomLayout}
        title={"Made with Love"}
        login={Login}
        authProvider={authProvider}
    >
      {<Resource name={"clientes"} list={ListGuesser} create={CreateCliente}  edit={EditCliente} options={{label:'Clientes'}}/>}
      {/*<Resource name={"tipo-clientes"} list={ListGuesser} edit={EditTipoClientes} create = {CreateTipoClientes} options={{label:'Tipo de Clientes'}}  />*/}
      <Resource name={"categorias"} list={ListCategoria} edit={EditCategoria} create={CreateCategoria} />
      <Resource name={"inventario"} list={ListInventario}  create={CreateInventario} edit={EditInventario} />
      <Resource name={"productos"} list={ProductList} create={ProductCreate} edit={ProductEdit}/>
      <Resource name={"subcategorias"} create={CreateSubcategoria} list={ListGuesser} edit={EditSubcategoria} />
      <Resource name={"recetario"} create={CreateRecetario} list={ListRecetario} edit={EditRecetario}/>
      <Resource name={"categorias-inventario"} create={CategoriaInventarioCreate} edit={CategoriaInventarioEdit} list={CategoriaInventarioList}/>
    </Admin>
  );
}

export default App;
