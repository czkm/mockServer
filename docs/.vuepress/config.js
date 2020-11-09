module.exports = {
  base: '/mockServer/dist/',
  title: 'mockServer', // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: 'node接口缓存服务', // meta 中的描述文字，用于SEO
  dest: './dist',
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link', { rel: 'ico', href: '/public/mockServer.ico' }],  //浏览器的标签栏的网页图标
  ],
  markdown: {
    lineNumbers: true
  },
  serviceWorker: true,
  themeConfig: {
    logo: '/home.png',
    lastUpdated: 'lastUpdate', // string | boolean
    nav: [
      { text: '首页', link: '/' },

      { text: 'about', link: '/pages/folder1/test3.md' },
      { text: 'Github', link: 'https://github.com/czkm/mockServer' },
    ],
    //侧边导航栏：会根据当前的文件路径是否匹配侧边栏数据，自动显示/隐藏
    sidebar: {

      '/pages/folder1/': [
        {
          title: '写在前面',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          sidebarDepth: 2,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          children: [
            ['demo.md', '前言'] //菜单名称为'子菜单1'，跳转至/pages/folder1/test1.md
          ]
        },
        {
          title: '项目构建',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          sidebarDepth: 2,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          children: [
            ['test2.md', '项目构建'],  //菜单名称为'子菜单1'，跳转至/pages/folder1/test1.md
          ]
        },
        {
          title: '使用说明',
          collapsable: false,
          children: [
            ['test3.md', '使用说明']
          ]
        },
        {
          title: 'electron版本💫',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          sidebarDepth: 2,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          children: [
            ['test4.md', '项目构建'],  //菜单名称为'子菜单1'，跳转至/pages/folder1/test1.md
          ]
        },
      ]
    }
  }
}