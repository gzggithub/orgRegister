module.exports = {
    proxy: {
        '/api': {//将https://sixsix.taoerxue.com.cn映射为/api
            // 测试代理地址
            target: 'https://sixsix.taoerxue.com.cn',
            // 正式代理地址
            // target: 'https://newapi.taoerxue.cn',
            changeOrigin: true,  //是否跨域
            pathRewrite: {//需要rewrite的
                '^/api': ''
            }
            // 因为在ajax的url中加了前缀'/api'，而原本的接口是没有这个前缀的,所以需要通过 pathRewrite 来重写地址，将前缀 '/api' 转为 '/'
        }
    }
}