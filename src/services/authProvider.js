import axios from 'axios';
import Cookies from "universal-cookie";

const cookies = new Cookies()

const authProvider = {
    login: ({email,password}) => {
        return axios.post(process.env.REACT_APP_API_URL+'/usuarios/login',{email,password}).then(
             (res => {
                 cookies.set('token',res.data.token)
                 cookies.set('user',res.data.user)

             })
         ).catch(err =>{

            if (err.response.status===422)
                return Promise.reject('La contraseña debe tener mas de ocho caracteres')

            if (err.response.status===401)
                return Promise.reject('Credenciales Invalidas')


            return Promise.reject(err.response.data.error.message)

        })
    },
    logout: () => {
        cookies.remove('token')
        cookies.remove('user')
        return Promise.resolve();
    },
    checkError:error => {

        const status = error.status;
        if (status === 401 || status === 403) {
            cookies.remove('token');
            cookies.remove('user')

            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () =>{
        return  cookies.get('token') && cookies.get('user') ? Promise.resolve() : Promise.reject()
    },
    getPermissions: () => {
        const user = cookies.get('user')
        return user? Promise.resolve(user.roles):Promise.reject('No se encontro el usuario ni el rol')
    }
};

export default authProvider;
