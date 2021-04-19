const host = '3.142.240.248:3000'

export const environment = {
  production: false,
  backend: {
    baseURL: `http://${host}/`,
    authUrl: `http://${host}/auth/`
  }
}
