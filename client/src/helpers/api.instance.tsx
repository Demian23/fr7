import Api from './api'
const apiRoot = process.env.REACT_APP_API || 'noapierror'
const api = new Api(apiRoot)
export default api
