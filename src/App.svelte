<script>
    // 依赖集
    import { createKeybindingsHandler } from 'tinykeys';
    import { GM_setValue, GM_getValue, GM_listValues, GM_deleteValue } from '$';
    // 图片集
    import logoSvg from './assets/logo.png';
    import addSvg from './assets/add.svg?raw';
    import helpSvg from './assets/help.svg?raw';
    import githubSvg from './assets/github.svg?raw';
    import gouSvg from './assets/gou.svg?raw';
    import closeSvg from './assets/close.svg?raw';
    // 组件集
    // 工具集
    // 生成随机数
    const generateRandomString = (length) => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    // 变量集
    let isActiveKuaiTiao = false;
    let isActiveAddDialog = false;
    let siteName = ''; // 导航名称
    let siteLink = ''; // 导航地址
    let sitesGrid = [];
    // 功能集

    // 监听快捷键
    const handler = createKeybindingsHandler({
        'Control+q': () => {
            isActiveKuaiTiao = !isActiveKuaiTiao;
        }
    });
    window.addEventListener('keydown', handler);

    // 渲染SVG
    const getSvgCode = (data) => {
        return decodeURIComponent(data).replace(/https?\:\/\/.+\/assets\//, '');
    };

    // 渲染站点列表
    const renderSiteGrids = () => {
        const listKeys = GM_listValues();
        const listValues = listKeys.map((key) => {
            const siteGroup = GM_getValue(key);
            const [siteName, siteLink] = siteGroup.split('|');
            return {
                siteName: siteName,
                siteLink: siteLink,
                siteKey: key
            };
        });
        sitesGrid = listValues;
    };

    // 添加导航
    const fnAddSite = () => {
        const siteKey = generateRandomString(10);
        GM_setValue(siteKey, siteName + '|' + siteLink);
        siteName = '';
        siteLink = '';
        isActiveAddDialog = false;
        renderSiteGrids();
    };

    // 删除导航
    const fnDelSite = (siteKey) => {
        GM_deleteValue(siteKey);
        renderSiteGrids();
    };

    // 拖放
    let draggedElement = null;

    document.addEventListener('dragstart', function (e) {
        draggedElement = e.target;
        e.dataTransfer.setData('text/plain', null);
    });

    document.addEventListener('dragover', function (e) {
        e.preventDefault(); // 允许拖放
    });

    document.addEventListener('drop', function (e) {
        console.log('🚀 ~ e:', e);
        e.preventDefault();
        if (e.target.className === 'box') {
            // const temp = draggedElement.cloneNode(true);
            // draggedElement.parentNode.insertBefore(e.target, draggedElement);
            // draggedElement.parentNode.insertBefore(draggedElement, e.target);
            // draggedElement = temp;
        }
    });

    // 执行集
    renderSiteGrids();
</script>

<template>
    <div class="kuaitiao" class:active={isActiveKuaiTiao}>
        <div class="logo" style="background-image: url('{logoSvg}');"></div>
        <div class="panel">
            <div class="group">
                <div class="grid" id="grid">
                    {#each sitesGrid as item (item.siteKey)}
                        <div class="box" draggable="true">
                            <div class="inner">
                                <a class="link" target="_blank" href={item.siteLink} on:click={() => (isActiveKuaiTiao = false)}>
                                    <div class="dot"></div>
                                    <div class="text">{item.siteName}</div>
                                </a>

                                <div class="close" on:click={fnDelSite(item.siteKey)} aria-hidden="true">{@html getSvgCode(closeSvg)}</div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="foot">
            <div class="left">
                <a target="_blank" href="https://chensuiyi.me">作者：陈随易</a>
            </div>
            <div class="center">
                <div class="icon add-site" on:click={() => (isActiveAddDialog = !isActiveAddDialog)} aria-hidden="true">
                    {@html getSvgCode(addSvg)}
                </div>
            </div>
            <div class="right">
                <a class="icon" target="_blank" href="https://github.com/chenbimo/kangaroo-jump">{@html getSvgCode(githubSvg)}</a>
            </div>
        </div>
        <div class="dialog add" class:active={isActiveAddDialog}>
            <div class="info">
                <div class="input">
                    <input bind:value={siteName} placeholder="请输入名称" />
                </div>
                <div class="input">
                    <input bind:value={siteLink} placeholder="请输入网址" />
                </div>
            </div>
            <div class="send" on:click={fnAddSite} aria-hidden="true">{@html getSvgCode(gouSvg)}</div>
        </div>
    </div>
</template>

<style lang="scss" global>
    .kuaitiao {
        position: fixed;
        top: 50vh;
        left: 50vw;
        height: 600px;
        width: 1000px;
        margin-top: -300px;
        margin-left: -500px;
        z-index: 999999999;
        display: none;
        background-color: #333;
        border: 2px solid #999;
        border-radius: 10px;
        font-size: 14px;
        &.active {
            display: block;
        }

        .logo {
            position: absolute;
            top: -30px;
            left: 50%;
            margin-left: -30px;
            height: 60px;
            width: 60px;
            border: 2px solid #999;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            border-radius: 20px;
        }
        .panel {
            position: absolute;
            left: 15px;
            right: 0px;
            bottom: 41px;
            top: 40px;
            .group {
                .name {
                }
                .grid {
                    display: flex;
                    flex-wrap: wrap;
                }
                .box {
                    padding-right: 15px;
                    flex: 0 0 calc(100% / 6);
                    margin-bottom: 15px;
                    .inner {
                        height: 40px;
                        background-color: #555;
                        border-radius: 20px;
                        padding: 0 10px;
                        transition: all 0.2s;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .link {
                            flex: 1 1 100%;
                            display: flex;
                            align-items: center;
                            color: #fff;
                        }
                        .close {
                            flex: 0 0 auto;
                            font-size: 18px;
                            cursor: pointer;
                            .close-icon {
                                fill: #666666;
                                transition: all 0.2s;
                            }
                            &:hover {
                                .close-icon {
                                    fill: #ee3333;
                                }
                            }
                        }
                        &:hover {
                            box-shadow: 0px 2px 0px #888;
                            .dot {
                                background-color: #3fed2d;
                            }
                        }
                        .dot {
                            flex: 0 0 12px;
                            height: 12px;
                            background-color: #999;
                            margin-right: 6px;
                            border-radius: 6px;
                            transition: all 0.2s;
                        }
                        .text {
                            flex: 1 1 100%;
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
        }
        .foot {
            position: absolute;
            bottom: 0;
            left: 15px;
            right: 15px;
            height: 26px;
            border-top: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
                flex: 0 0 45%;
                font-size: 12px;
                color: #666;
                cursor: pointer;
                transition: all 0.2s;
                &:hover {
                    color: #999;
                }
            }
            .right {
                flex: 0 0 45%;
                display: flex;
                justify-content: flex-end;
                font-size: 16px;
                .icon {
                    cursor: pointer;
                    svg {
                        transition: all 0.2s;
                        fill: #666;
                    }
                    &:hover {
                        svg {
                            fill: #999;
                        }
                    }
                }
            }
            .center {
                flex: 0 0 10%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                .icon {
                    cursor: pointer;
                    .plus {
                        fill: #cccccc;
                        transition: all 0.2s;
                    }
                    &:hover {
                        .plus {
                            fill: #ffffff;
                        }
                    }
                }
            }
        }
        .dialog.add {
            position: absolute;
            bottom: 35px;
            width: 200px;
            height: 52px;
            border: 2px solid #999;
            background-color: #fff;
            left: 50%;
            margin-left: -100px;
            border-radius: 6px;
            display: none;
            &.active {
                display: block;
            }
            .info {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 160px;
                .input:first-of-type {
                    border-bottom: 1px solid #ccc;
                }
                input {
                    height: 24px;
                    background-color: transparent;
                    padding: 0 6px;
                    &::placeholder {
                        font-size: 12px;
                    }
                }
            }
            .send {
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                width: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                cursor: pointer;
                .gou {
                    fill: #666;
                    transition: all 0.2s;
                }
                &:hover {
                    .gou {
                        fill: #00b42a;
                    }
                }
            }
        }
    }
</style>
