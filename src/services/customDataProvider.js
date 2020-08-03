import providerLb4 from "./providerLb4";
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
            return dataProvider.create(resource,params);

        if (params.data.imagenRuta.rawFile instanceof File){

            return convertFileToBase64(params.data.imagenRuta.rawFile).then(
                stringPic =>{

                    params.data.imagenRuta.rawFile = stringPic;

                    return  dataProvider.update(resource, params);


                }
            )

        }

    }
}

const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file);
    });