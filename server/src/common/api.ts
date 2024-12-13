export default class Api {
    prefix = ''

    constructor(apiPrefix: string) {
        this.prefix = apiPrefix
    }

    movies = () => {
        return '/' + this.prefix + '/movies'
    }

    user = () => {
        return '/' + this.prefix + '/user'
    }

    create = () => {
        return '/create'
    }

    login = () => {
        return '/login'
    }

    byId = (id: string = ':id') => {
        return '/' + id
    }

    person = () => {
        return '/person'
    }

    mark = () => {
        return '/mark'
    }

    delete = () => {
        return '/delete'
    }

    refresh = () => {
        return '/refresh'
    }

    expired = () => {
        return '/expired'
    }

    info = () => {
        return '/info'
    }

    userIdParam = (id: string) => {
        return `?userId=${id}`
    }
}
