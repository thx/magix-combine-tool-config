'use strict'
const ts = require('typescript')
const path = require('path')

module.exports = (magixCliConfig, customConfig = {}, cwd) => {
    let srcFolder = magixCliConfig.srcFolder || 'src' //source folder
    let buildFolder = magixCliConfig.buildFolder || 'build' //build folder
    let globalCssPaths = magixCliConfig.globalCss || [
        './src/app/gallery/mx-style/index.less'
    ]

    let scopedCssPaths = magixCliConfig.scopedCss || [
        './src/app/assets/iconfont.less'
    ]
    let galleriesLgRoot = magixCliConfig.galleriesLgRoot || 'app/gallery-local/'
    let galleriesMxRoot = magixCliConfig.galleriesMxRoot || 'app/gallery/'

    //非项目目录时，修正目录
    if (cwd) {
        srcFolder = path.resolve(cwd, srcFolder)
        buildFolder = path.resolve(cwd, buildFolder)
        globalCssPaths = globalCssPaths.map(_path => {
            return path.resolve(cwd, _path)
        })
        scopedCssPaths = scopedCssPaths.map(_path => {
            return path.resolve(cwd, _path)
        })
    }

    let config = {
        debug: true,
        tmplFolder: srcFolder,
        srcFolder: buildFolder,
        loaderType: magixCliConfig.magixLoaderType || 'cmd',
        cssSelectorPrefix: magixCliConfig.rootAppName || '', //请填写app唯一标识，防止上线的时候样式名压缩与全局样式冲突
        tmplBindEvents: ['change', 'input', 'keyup'],
        tmplArtEngine: true, //类mustach引擎
        magixUpdaterIncrement: true,
        addTmplViewsToDependencies: true,
        checker: {
            // css: false, //样式
            // cssUrl: false, //样式中的url
            // tmplAttrImg: false, //模板img属性
            // jsService: false, //js接口服务
            // jsLoop: false, //js循环
            // jsThis: false, //js this别名
            // tmplDisallowedTag: true, //不允许的标签
            // tmplAttrDangerous: true, //危险的属性
            // tmplAttrIframe: true, //检测iframe相关
            // tmplAttrMxEvent: true, //mx事件
            // tmplAttrMxView: true, //mx view
            // tmplDuplicateAttr: true, //重复的属性
            // tmplCmdFnOrForOf: true, //模板中函数或for of检测
            // tmplTagsMatch: true //标签配对
            jsLoop: false, //js循环
            tmplAttrAnchor: false, //检测anchor类标签，a标签javascript:;
        },
        globalCss: globalCssPaths,
        scopedCss: scopedCssPaths,

        galleries: {
            lgRoot: galleriesLgRoot,
            mxRoot: galleriesMxRoot,
            mxMap: {}
        },
        compileTmplCommand(content) {
            var str = ts.transpileModule(content, {
                compilerOptions: {
                    lib: ['es7'],
                    target: 'es3',
                    module: ts.ModuleKind.None
                }
            });
            str = str.outputText;
            return str;
        },
        compileJSStart(content, from) {
            var str = ts.transpileModule(content, {
                compilerOptions: {
                    lib: ['es7'],
                    target: magixCliConfig.magixJsTranspile || 'es3',
                    module: ts.ModuleKind.None
                }
            });
            str = str.outputText;
            return str;
        },

        mxViewProcessor(view) {
            if (!magixCliConfig.dynamicProjectName) {
                return
            }

            let { path, pkgName } = view;
            let fi = path.indexOf('/');
            if (fi > 0) {
                let p = path.substring(0, fi);
                let s = path.substring(fi);
                if (p == pkgName && path.indexOf('/gallery/') > -1) {
                    return '{{=pkgName}}' + s;
                }
            }
        }
    }

    Object.assign(config, customConfig)

    return config
}