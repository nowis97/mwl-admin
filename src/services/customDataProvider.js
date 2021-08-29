import providerLb4 from "./providerLb4";
import { querySearchTextInsensitive} from "../components/helpers/filterstoqueries";
const API = process.env["REACT_APP_API_URL"];

const dataProvider = providerLb4(API);

export const myDataProvider = {
    ...dataProvider,
    create: (resource,params) =>{
        if (resource !== 'productos' || !params.data.imagenRuta )
            return dataProvider.create(resource,params);

        if (params.data.imagenRuta.rawFile instanceof File){

            return convertFileToBase64(params.data.imagenRuta.rawFile).then(
                stringPic =>{

                    params.data.imagenRuta.rawFile = stringPic;

                    return  dataProvider.create(resource, params);


                }
            )

            }
    },

    update:(resource,params) =>{
        if (resource !== 'productos' || !params.data.imagenRuta )
            return dataProvider.update(resource,params);

        if (params.data.imagenRuta.rawFile instanceof File){

            return convertFileToBase64(params.data.imagenRuta.rawFile).then(
                stringPic =>{

                    params.data.imagenRuta.rawFile = stringPic;

                    return  dataProvider.update(resource, params);


                }
            )

        }

    },

    getList: (resource,params) =>{

        if (resource === "etiquetas" || resource === 'delivery')
            return dataProvider.getList('pedidos',params)

        if (resource !== 'clientes' && resource !== 'productos')
            return dataProvider.getList(resource,params)

        if (!params.filter) return dataProvider.getList(resource,params)


        return dataProvider.getList(resource,params)



    }
}

const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
