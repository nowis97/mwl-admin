import React from 'react';
import './App.css';


import {Admin,Resource} from "react-admin";
import CustomLayout from "./components/layout/CustomLayout";
import {CreateCliente} from "./components/Resources/Clientes/CreateCliente";
import {EditCliente} from "./components/Resources/Clientes/EditCliente";
import {ListGuesser,usePermissions} from 'react-admin';
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
import {MyLogin} from './components/layout/MyLoginForm';
import authProvider from "./services/authProvider";
import ProductEdit from "./components/Resources/Productos/ProductEdit";
import {ShowProduccion} from "./components/Resources/Produccion";
import CreatePedidos from "./components/Resources/Pedidos/CreatePedidos";
import {ListPedidos} from "./components/Resources/Pedidos/ListPedidos";
import EditPedidos from "./components/Resources/Pedidos/EditPedidos";
import {ShowPedidos} from "./components/Resources/Pedidos/ShowPedidos";
import {ProduccionList} from "./components/Resources/Produccion/ProduccionList";
import {ListCliente} from "./components/Resources/Clientes/ListCliente";
import {EtiquetasList} from "./components/Resources/Etiquetas/EtiquetasList";
import {Route} from "react-router-dom";
import {CambiarEstadoPedido} from "./components/Resources/Pedidos/CambiarEstado/CambiarEstadoPedido";
import {UsuariosCreate, UsuariosEdit, UsuariosList} from "./components/Resources/AdmUsuarios/Usuarios";
import {DeliveriesList} from "./components/Resources/Delivery/DeliveriesList";
import {RecursosCreate, RecursosEdit, RecursosList} from "./components/Resources/AdmUsuarios/Recursos";
import {RolesCreate, RolesEdit, RolesList} from "./components/Resources/AdmUsuarios/Roles";
import {ListSubcategorias} from "./components/Resources/Subcategorias/ListSubcategorias";
import {ProfileEdit} from "./components/Resources/AdmUsuarios/ProfileEdit";

const i18nProvider = polyglotI18nProvider(() => spanishMessages, 'es');

const customRoutes = [
    <Route exact path={"/cambiar-estado"} component={CambiarEstadoPedido}/>,
    <Route exact path={"/mi-perfil"} component={ProfileEdit}/>
]

function App(){
    return (
    <Admin
        dataProvider ={myDataProvider}
        i18nProvider={i18nProvider}
        layout={CustomLayout}
        title={"Made with Love"}
        loginPage={MyLogin}
        authProvider={authProvider}
        customRoutes={customRoutes}
    >


      <Resource name={"clientes"} list={ListCliente} create={CreateCliente}  edit={EditCliente} options={{label:'Clientes'}}/>
      {/*<Resource name={"tipo-clientes"} list={ListGuesser} edit={EditTipoClientes} create = {CreateTipoClientes} options={{label:'Tipo de Clientes'}}  />*/}
      <Resource name={"categorias"} list={ListCategoria} edit={EditCategoria} create={CreateCategoria} />
      <Resource name={"inventario"} list={ListInventario}  create={CreateInventario} edit={EditInventario} />
      <Resource name={"productos"} list={ProductList} create={ProductCreate} edit={ProductEdit}/>
      <Resource name={"subcategorias"} create={CreateSubcategoria} list={ListSubcategorias} edit={EditSubcategoria} />
      <Resource name={"recetario"} create={CreateRecetario} list={ListRecetario} edit={EditRecetario}/>
      <Resource name={"categorias-inventario"} create={CategoriaInventarioCreate} edit={CategoriaInventarioEdit} list={CategoriaInventarioList}/>
      <Resource name={"producciones"} list={ProduccionList} show={ShowProduccion}/>
      <Resource name={"pedidos"} create={CreatePedidos} edit={EditPedidos} list={ListPedidos} show={ShowPedidos}/>
      <Resource name={"etiquetas"} list={EtiquetasList}/>
      <Resource name={"usuarios"} list={UsuariosList} edit={UsuariosEdit} create={UsuariosCreate}/>
      <Resource name={"recursos"} list={RecursosList} edit={RecursosEdit} create={RecursosCreate}/>
      <Resource name={"roles"} list={RolesList} edit={RolesEdit} create={RolesCreate}/>
      <Resource name={"delivery"} list={DeliveriesList} />
    </Admin>
  );
}

export default App;
