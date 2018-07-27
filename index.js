'use strict'
const ts = require('typescript')

module.exports = (magixCliConfig, customConfig = {}) => {
    let srcFolder = magixCliConfig.srcFolder || 'src' //source folder
    let buildFolder = magixCliConfig.buildFolder || 'build' //build folder
    let config = {
        debug: true,
        tmplFolder: srcFolder,
        srcFolder: buildFolder,
        loaderType: 'cmd',
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
        globalCss: magixCliConfig.globalCss || [
            './src/app/gallery/mx-style/index.less'
        ],
        scopedCss: magixCliConfig.scopedCss || [
            './src/app/assets/iconfont.less'
        ],

        galleries: {
            lgRoot: magixCliConfig.galleriesLgRoot || 'app/gallery-local/',
            mxRoot: magixCliConfig.galleriesMxRoot || 'app/gallery/',
            mxMap: {
                'mx-popover': {
                    tag: 'span'
                },
                'mx-calendar.rangepicker': {
                    tag: 'div'
                },
                'mx-switch': {
                    tag: 'span'
                },
                'mx-table'(tag) {
                    let content = tag.content;
                    let ctrl = tag.seprateAttrs('div');
                    content = content.replace(/<table/g, '<div>$&').replace(/<\/table>/g, '$&</div>');
                    return `<${ctrl.tag} mx-view="${tag.mxView}" ${ctrl.attrs} ${ctrl.viewAttrs}>${content}</${ctrl.tag}>`;
                },
                'mx-table.excel'(tag) {
                    let content = tag.content;
                    let ctrl = tag.seprateAttrs('div');
                    content = content.replace(/<table/g, '<div>$&').replace(/<\/table>/g, '$&</div>');
                    return `<${ctrl.tag} mx-view="${tag.mxView}" ${ctrl.attrs} ${ctrl.viewAttrs}>${content}</${ctrl.tag}>`;
                },
                'mx-table.list'(tag) {
                    let content = tag.content;
                    let ctrl = tag.seprateAttrs('div');
                    content = content.replace(/<table/g, '<div>$&').replace(/<\/table>/g, '$&</div>');
                    return `<${ctrl.tag} mx-view="${tag.mxView}" ${ctrl.attrs} ${ctrl.viewAttrs}>${content}</${ctrl.tag}>`;
                }
            }
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
                    target: 'es3',
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