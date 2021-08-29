export default function (roles,recurso, permiso = undefined) {
    if (!roles || !recurso) return false

    const permisosRecursosAllRoles = roles.map(val => val.permisosRecursos).flat()

    const recursoFound = permisosRecursosAllRoles.find(obj => obj.recurso === recurso)

    if (!permiso)
        return Boolean(recursoFound);

    const permisoFound = recursoFound.permisos.find(val => val === permiso)

    return Boolean(permisoFound)



}

