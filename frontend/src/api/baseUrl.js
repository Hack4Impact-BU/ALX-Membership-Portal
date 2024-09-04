const baesUrls = {
    development: 'http://localhost:3002/v1/',
    staging: '',
    production: '',
    test: '',
}

const baseURL = baseUrls[process.env.NODE_ENV || 'development']

export default baseURL