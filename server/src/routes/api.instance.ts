import Api from '../common/api'
const apiRoot = process.env.API || 'noapierror'
const api = new Api(apiRoot)
export default api
