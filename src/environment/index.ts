type Env = 'development' | 'production'

interface IEnvironment {
    publicPath: string
    env: Env
}

export const environment: IEnvironment = {
    // @ts-ignore
    publicPath: __webpack_public_path__,
    // @ts-ignore
    env: process.env.NODE_ENV as Env
}

console.log(environment)
