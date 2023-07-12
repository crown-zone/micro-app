// 没有加载过
export const NOT_LOADED = 'NOT_LOADED'
// 加载源代码
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'
// 没有启动
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'
// 启动中
export const BOOTSTRAPPING = 'BOOTSTRAPPING'
// 没有挂载
export const NOT_MOUNTED = 'NOT_MOUNTED'
// 挂载中
export const MOUNTING = 'MOUNTING'
// 挂载完成
export const MOUNTED = 'MOUNTED'
// 更新中
export const UPDATING = 'UPDATING'
// 卸载中
export const UNMOUNTING = 'UNMOUNTING'
// 销毁中
export const UNLOADING = 'UNLOADING'
// 加载失败
export const LOAD_ERROR = 'LOAD_ERROR'
// 运行出错
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'

// 当前应用是否被挂载完成
export function isActive(app) {
    return app.status === MOUNTED
}

// 当前app是否应该激活，activeWhen匹配上，表示要激活
export function shouldBeActive(app) {
    return app.activeWhen(window.location)
}
