import {fetchUtils} from 'react-admin';
import * as moment from "moment";
import {getTimeZoneLocal} from "../components/helpers/helpers";
import {querySearchTextInsensitive} from "../components/helpers/filterstoqueries";

export default (apiUrl, httpClient = fetchUtils.fetchJson) => ( {
    getAll :(resource) =>{
        const url = `${apiUrl}/${resource}`;
        return httpClient(url).then((res)=>({data: res.json}))
    },

    getList: (resource, params) =>{
        const {page, perPage} = params.pagination;
        const {field,order} = params.sort;

        const query ={
            order: [field +' '+order],
            limit:perPage,
            skip: (page-1) *perPage,
            where: params.filter
        }

        for (const resourceKey in params.filter) {
            if (resourceKey.includes(':')){
                const key = resourceKey.split(':')[1]
                params.filter[key] = querySearchTextInsensitive(params.filter[resourceKey])
                delete params.filter[resourceKey];

            }
        }


        for (const key in params.filter) {
            const dateFormatUSA = moment(params.filter[key],'YYYY-MM-DD',true);

            const dateFormatChile = moment(params.filter[key],'DD-MM-YYYY',true);


             if (dateFormatUSA.isValid()) {
                 params.filter[key] = dateFormatUSA.toJSON();
             }else if (dateFormatChile.isValid()){
                 params.filter[key] = dateFormatChile.toJSON();
             }

        }


        const url = `${apiUrl}/${resource}?filter=${JSON.stringify(query)}`;


        return Promise.all([
            httpClient(url),
            getCount(apiUrl,resource)
        ]).then(promises =>{
            return {
                data: promises[0].json,
                total: promises[1].json.count
            };
        })


    },
    getOne: (resource,params) =>{
        return httpClient(`${apiUrl}/${resource}/${params.id}`)
            .then(
                (res) => {
                    return ({data: res.json})
                }
            );
    },

    getMany: (resource,params) =>{
        return Promise.all(
                params.ids.map(i => httpClient(`${apiUrl}/${resource}/${i}`)
            )
        ).then(responses => {
            return {data: responses.map(res => { return res.json})
        }});

    },

    getManyReference: (resource, params) =>{
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const query ={
            order: [field +' '+order],
            limit:perPage,
            skip: (page-1) *perPage,
            where: {...params.filter, [params.target] :params.id}
        }
        const url = `${apiUrl}/${resource}?filter=${JSON.stringify(query)}`;

        return Promise.all([
            httpClient(url),
            getCount(apiUrl,resource)
        ]).then(promises =>{
            return {
                data: promises[0].json,
                total: promises[1].json.count
            };
        })
    },

    create: (resource, params) =>{

        return httpClient(`${apiUrl}/${resource}`, {
                method: 'POST',
                body: JSON.stringify(params.data)
            }).then(({json}) => ({
                data: json
            }))

    },

    delete: (resource,params) =>{
        return httpClient(`${apiUrl}/${resource}/${params.id}`,{
            method:'DELETE',
        }).then(() => ({ data:params.previousData}))
    },

    deleteMany: (resource,params) =>{
       return  Promise.all(
           params.ids.map(id =>{
               return httpClient(`${apiUrl}/${resource}/${id}`,{
                   method:'DELETE',
               }).then(() => (id))
           })
       ).then(responses =>{
           return {data: responses}
       })
    },

    update: (resource, params) =>{
        const id = params.data.id;
        delete params.data.id;
        return  httpClient(`${apiUrl}/${resource}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: {...json,'id':id} }))

    },

    updateMany:(resource,params) =>{
        Promise.all(
            params.ids.map(
                id =>{
                    const id_ = id;
                    delete params.data.id;

                    return  httpClient(`${apiUrl}/${resource}/${id_}`, {
                        method: 'PUT',
                        body: JSON.stringify(params.data),
                    }).then(({ json }) => ({ data: {...json,'id':id_} }))
                }
            )
        ).then(responses =>{
            return {data: responses.map(responses.json)}
        });

    }


});

const getCount = (apiUrl,resource) => {
    return fetchUtils.fetchJson(`${apiUrl}/${resource}/count`);
}
