<template>
    <div class="institution-register">
        <p class="topTips" v-show="hiddenFlag">请认真完善机构信息，方便您快速入驻</p>
        <div class="content-box" v-show="hiddenFlag">
            <ul class="form">
                <li ref="name" class="item name clearfix necessary" :class="checkList.name ? '' : 'error'">
                    <div class="item-title">机构名称</div>
                    <div class="item-content">
                        <input type="text" placeholder="请输入机构名称（20个字以内）" v-on:input="nameCheck" v-model="data.name">
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="typeIds" class="item typeIds clearfix necessary" :class="checkList.typeIds ? '' : 'error'" @click="chooseOrg">
                    <div class="item-title">机构类型</div>
                    <div class="item-content">
                        <p class="typeNames " :class="typeNames ? '' : 'empty'"> {{typeNames || "请选择机构类型（最多3项）"}}</p>
                        <div class="right" @click="chooseOrg"></div>
                    </div>
                </li>
                <div class="segmentingLine"></div>
                <li ref="telephone" class="item telephone clearfix necessary" :class="checkList.telephone ? '' : 'error'">
                    <div class="item-title">机构电话</div>
                    <div class="item-content">
                        <input type="text" placeholder="请输入机构电话" v-model="data.telephone">
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="managerName" class="item adminUserName clearfix necessary" :class="checkList.managerName ? '' : 'error'">
                    <div class="item-title">管理员</div>
                    <div class="item-content">
                        <input type="text" placeholder="请输入机构管理员名字" v-model="data.managerName">
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="managerPhone" class="item adminUserPhone clearfix necessary" :class="checkList.managerPhone ? '' : 'error'">
                    <div class="item-title">手机号码</div>
                    <div class="item-content">
                        <input type="text" placeholder="请输入管理员手机号" v-model="data.managerPhone">
                        <button type="button" class="codeButton" :class="isPhoneNumber ? 'active' : ''" @click="sendCode">
                            <span>{{codeButtonStatus?"获取验证码":countDown+"s后重发"}}</span>
                        </button>
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="code" class="item code clearfix necessary" :class="checkList.code ? '' : 'error'">
                    <div class="item-title">验证码</div>
                    <div class="item-content">
                        <input type="text" placeholder="请输入管理员手机验证码" v-model="data.code">
                    </div>
                </li>
                <div class="segmentingLine"></div>
                <li ref="photos" class="item photo clearfix necessary" :class="checkList.photos ? '' : 'error'">
                    <div class="item-title">机构图片</div>
                    <div class="item-content">
                        <div class="photoTipsBox clearfix">
                            <span class="tips">请上传1-5张机构展示图片</span>
                            <!-- <span class="example">示例</span> -->
                        </div>
                        <div class="photoListBox">
                            <ul v-if="data.photos.length" class="photoList">
                                <li class="photoItem" v-for="(item, index) in data.photos">
                                    <img :src="photoUrl + item" alt="" />
                                    <div class="photoDelete" @click="photoDelete(index)"></div>
                                </li>
                            </ul>
                            <div class="op-button clearfix" v-if="data.photos.length <= 5">
                                <label for="photoUploads" class="btn" v-show="!photoLoading">
                                    <div></div>
                                </label>
                                <!-- 加载中... -->
                                <div class="loading photoLoading" v-show="photoLoading"></div>
                                <input ref="photoInputEle" type="file" name="file" id="photoUploads" accept="image/png, image/jpeg, image/gif, image/jpg" style="position: absolute;clip:rect(0px, 0px, 0px, 0px);"
                                @change="uploadImg($event, 1)">
                            </div>                            
                        </div>
                        <!-- <div class="wrapper">
                            <vueCropper v-if="photoOption.fileChoiced" ref="photoCropper" :img="photoOption.img" :autoCrop="true"
                             :autoCropWidth="180" :autoCropHeight="100" :fixedBox="true" :canMoveBox="false" :outputSize="1" outputType="jpeg"
                             :info="false" :canMove="true">
                            </vueCropper>
                            <button v-if="photoOption.fileChoiced" type="button" class="photoSubmit" @click="photoSubmit">图片提交</button>
                        </div>
                        <p v-show="photoOption.fileChoiced&&photoList.length===0" class="wrapperHint">可通过鼠标滑动调整图片大小和位置</p> -->
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="description" class="item description clearfix necessary" :class="checkList.description ? '' : 'error'">
                    <div class="item-title">机构简介</div>
                    <div class="item-content">
                        <textarea name="" id="" cols="50" rows="10" placeholder="可从针对多大年龄段的学生、机构特色、经营范围、课程特色、成立年限等几方面进行阐述" v-model="data.description"></textarea>
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="icon" class="item icon clearfix necessary" :class="checkList.icon ? '' : 'error'">
                    <div class="item-title">LOGO</div>
                    <div class="item-content">
                        <div class="logoTipsBox clearfix">
                            <span class="tips">请上传机构LOGO</span>
                            <!-- <span class="example">示例</span> -->
                        </div>
                        <div class="logoUploaded" v-if="data.icon">
                            <img :src="photoUrl + data.icon" alt="">
                            <div class="logoDelete" @click="logoDelete"></div>
                        </div>
                        <div class="op-button clearfix" v-show="!data.icon">
                            <label v-show="!logoLoading" class="btn" for="logoUploads">
                                <div class="icon"></div>
                                <!-- <p>选择图片</p> -->
                            </label>
                             <!-- 加载中 -->
                            <div class="loading logoLoading" v-show="logoLoading"></div>
                            <input ref="logoInputEle" type="file" name="file" id="logoUploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
                            @change="uploadImg($event, 2)">
                        </div>
                        
                        <!-- 裁剪图片（目前不需要） -->
                        <!-- <div class="op-button clearfix">
                            <label for="logoUploads" class="btn">
                                <div></div>
                            </label>
                            <input type="file" id="logoUploads" accept="image/png, image/jpeg, image/gif, image/jpg" style="position: absolute; clip: rect(0, 0, 0, 0);" @change="uploadImg($event, 2)">
                            <input ref="logoInputEle" type="file" id="logoUploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
                            @change="uploadImg($event, 2)">
                        </div> -->
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="area" @click="orgAddress" class="item area clearfix necessary" :class="checkList.area ? '' : 'error'">
                    <div class="item-title">机构地址</div>
                    <div class="item-content">
                        <div class="pBox" :class="data.area ? '' : 'empty'">
                            <p>{{data.area || "请选择机构地址"}} </p>
                        </div>
                        <div class="right" @click="orgAddress"></div>
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="detailedAddress" class="item detailedAddress necessary" >
                    <textarea ref="addressTextarea" v-model="data.detailedAddress" name="" id="" rows="2" placeholder="请输入详细地址,例如道路、门牌号、小区、楼栋号、单元室等" class="detailedAddress"></textarea>
                </li>
                <div class="segmentingLine"></div>
                <li ref="companyName" class="item companyName clearfix necessary" :class="checkList.companyName ? '' : 'error'">
                    <div class="item-title">企业名称</div> 
                    <div class="item-content">
                        <input type="text" placeholder="请输入企业名称" v-model="data.companyName">
                    </div>
                    <div class="underline"></div>
                </li>
                <li ref="licenseNumber" class="item licenseNumber clearfix necessary" :class="checkList.licenseNumber ? '' : 'error'">
                    <div class="item-title">执照号码</div>
                    <div class="item-content">
                        <input placeholder="请输入18位执照号码" v-model="data.licenseNumber">
                    </div>
                    <div class="underline"></div>
                </li>
            </ul>
            <p class="submitTips">提醒：信息提交后审核结果将以短信通知。</p>
            <div class="submit clearfix" :class="submitButtonFlag ? 'active' : ''">
                <button type="button" class="button" @click="submit">
                    <!-- :disabled="!submitButtonFlag" -->
                    <span>提交审核</span>
                </button>
            </div>
        </div>
        <!-- 机构类型 -->
        <div class="typeSelect" v-show="typeFlag">
            <div class="title">
                <p>选择机构类型</p>
                <div class="return" @click="returnBack"></div>
                <div class="save" @click="save">保存</div>
            </div>
            <ul class="items" v-if="typeList.length">
                <li class="item" :class="" v-for="(item, index) in typeList" >
                    <span class="itemSpan" :class="orgIndex === index ? 'active' : ''" @click="selectParentOrgType(index)">{{item.name}}</span>
                    <ul class="subItems" v-show="orgIndex === index" v-if="item.sysOrgTypes">
                        <li class="subItem" :data-index="index" :class="item.allChecked ? 'checked' : ''" @click="selectOrgType(index, index, 'all', item.id)">
                            <span>全部</span>
                            <div class="icon">
                                <div></div>
                            </div>
                        </li>
                        <li class="subItem" :class="subItem.checked ? 'checked' : ''" v-for="(subItem, subIndex) in item.sysOrgTypes" @click="selectOrgType(index, subIndex, false, subItem.parentId)">   
                            <span>{{subItem.name}}</span>
                            <div class="icon">
                                <div></div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
            <p class="emptyTips" v-show="!typeList.length">暂无数据</p>
        </div>
        <!-- 机构图片 -->
        <div class="photoSelect" v-show="false">
            <div class="title">
                <div class="return"></div>
                <div class="photoSubmit " :class="photoOption.fileChoiced ? 'active' : ''" @click="photoSubmit">确认</div>
            </div>
            <div class="content">
                <!-- <vueCropper v-if="photoOption.fileChoiced" ref="photoCropper" :img="photoOption.img" :autoCrop="true"
                 :autoCropWidth="100" :autoCropHeight="100" :fixedBox="true" :canMoveBox="false" :outputSize="1" outputType="jpeg"
                 :info="false" :canMove="true">
                </vueCropper> -->
            </div>
        </div>
        <!-- 示例 -->
        <!-- <div class="photoExample" v-show="false">
            <div class="imgBox"><img src="https://image.taoerxue.com/" alt=""></div>
        </div> -->
        <!-- 机构logo -->
        <div class="logoSelect" v-show="false">
            <div class="title">
                <div class="return"></div>
                <div class="logoSubmit" :class="logoOption.fileChoiced ? 'active' : ''" @click="logoSubmit">确认</div>
            </div>
            <div class="content">
                <!-- <vueCropper v-if="logoOption.fileChoiced" ref="logoCropper" :img="logoOption.img" :autoCrop="true"
                 :autoCropWidth="100" :autoCropHeight="100" :fixedBox="true" :canMoveBox="false" :outputSize="1" outputType="jpeg"
                 :info="false" :canMove="true">
                </vueCropper> -->
            </div>
        </div>
        <!-- 机构logo示例 -->
        <!-- <div class="logoExample" style="display: none;">
            <div class="imgBox">
                <img src="https://image.taoerxue.com/" alt="">
            </div>
        </div> -->
        <!-- 机构地址省市区县 -->
        <div class="addressSelect" v-show="addressFlag">
            <div class="title">
                <p>选择机构地址</p>
                <div class="return" @click="returnBack"></div>
            </div>
            <ul class="selected">
                <li class="item" :disable="realdOnly" @click="setAddress(1, data.provinceName, data.provinceId)" v-model="data.provinceId">{{provinceName}}</li>
                <li class="item" :disable="realdOnly" @click="setAddress(2, data.cityName, data.cityId)" v-model="data.cityId">{{cityName}}</li>
                <li class="item" :disable="realdOnly" @click="setAddress(3, data.areaName, data.areaId)" v-model="data.areaId">{{areaName}}</li>
                <li class="item" :disable="realdOnly" @click="setAddress(4, data.street)" v-model="data.streeId">{{street}}</li>
            </ul>
            <div class="itemsBox">
                <ul class="items">
                    <li class="item" v-show="provinceFlag" v-for="(item, index) in provinceList" @click="setAddress(1, item.name)">{{item.name}}</li>
                    <li class="item" v-show="cityFlag" v-for="item in cityList" @click="setAddress(2, item.name)">{{item.name}}</li>
                    <li class="item" v-show="areaFlag" v-for="item in areaList"  @click="setAddress(3, item.name)">{{item.name}}</li>
                    <li class="item" :class="data.street === item.name ? 'active' : ''" v-show="streetFlag" v-for="item in streetList"  @click="setAddress(4, item.name)">{{item.name}}</li>
                </ul>
            </div>
        </div>
        <!-- 全局提示框 -->
        <!-- <div class="messageBox" v-show="message.flag">
            <div class="message clearfix">
                <div class="warning"></div>
                <span>{{message.value}}</span>
            </div>
        </div> -->
        <div class="messageBox messageBoxSuc" v-show="message.flag">
            <div class="message messageSuc clearfix" style="width: 60%;line-height: 1.7rem">
                <div class="warning" style="margin-left: 20px"></div>
                <!-- <div>提交成功！</div> -->
                <div style="text-align: center">{{message.value}}</div>
            </div>
        </div>
        <!-- 提交成功提示框 -->
        <div class="messageBoxSuc" v-show="message.flagSuc">
            <div class="messageSuc clearfix">
                <div class="success"></div>
                <div>提交成功！</div>
                <div>审核结果将以短信形式通知</div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import * as qiniu from 'qiniu-js';
    import * as UUID from 'uuid-js';
    // 图像处理组件
    import {vueCropper} from 'vue-cropper';
    export default {
        name: 'InstitutionRegister',
        // components: {
        //     vueCropper
        // },
        data() {
            return {
                // 测试接口地址
                baseUrl: 'https://sixsix.taoerxue.com.cn/taoerxue-app/1',
                // 正式接口地址
                // baseUrl: 'https://newapi.taoerxue.cn/2',
                // 图片地址前缀
                photoUrl: 'http://image.taoerxue.cn/',
                // photoUrl: 'https://image.taoerxue.com/',
                size: {
                    screenWidth: null,
                    screenHeght: null,
                    documentHeight: null
                },
                // 设置表单隐藏状态
                hiddenFlag: true,
                // 机构类型数据
                typeIdss: [],
                typeList: [],
                orgIndex: 0,
                orgSubIndex: 0,
                typeIndexSaved: [],
                // 机构类型状态
                typeFlag: false,
                chooseTypeFlag: false,

                // 图片上传token
                uploadToken: "",
                // 机构图片相关变量
                photoLoading: false,
                photoOption: {
                    fileChoiced: false,
                    img: ''
                },
                photoList: [],
                examplePhotoList: [],
                // 机构LOGO相关变量
                logoLoading: false,
                logoOption: {
                    fileChoiced: false,
                    img: ''
                },
                exampleLogo: "",
                data: {
                    source: 0,
                    name: "",
                    // 机构类型
                    typeIds: [],
                    telephone: "",
                    managerName: "",
                    managerPhone: "",
                    code: "",
                    description: "",
                    // 机构图片
                    photos: [],
                    icon: "",
                    detailedAddress: "",
                    provinceName: "",
                    provinceId: null,
                    cityName: "",
                    cityId: null,
                    areaName: "",
                    areaId: null,
                    street: "",
                    area: "",
                    companyName: "",
                    licenseNumber: ""
                },
                // 手机验证码相关变量
                codeButtonStatus: true,
                countDown: 0,
                fn_countDown: "",
                // 机构地址相关变量
                mapObj: "",
                realdOnly: false,
                provinceList: [],
                provinceFlag: true,
                cityList: [],
                cityFlag: false,
                areaList: [],
                areaFlag: false,
                streetList: [],
                streetFlag: false,
                markers: [],
                addressTips: "机构地址不能为空",
                addressFlag: false,
                addressStage: true,
                addressList: [],
                addressIndex: null,
                // 提交按钮状态变量
                submitButtonFlag: false,
                // 校验字段列表
                checkList: {
                    name: true,
                    typeIds: true,
                    telephone: true,
                    managerName: true,
                    managerPhone: true,
                    code: true,
                    photos: true,
                    description: true,
                    icon: true,
                    area: true,
                    detailedAddress: true,
                    companyName: true,
                    licenseNumber: true
                },
                // 全局提示框相关变量
                message: {
                    flag: false,
                    flagSuc: false,
                    value: "",
                    fnTimeout: ""
                },
                scrollTop: '',
            }
        },
        created: function() {
            // 获取机构类型列表
            this.getType();
            // 暂时不用
            window.onscroll = function() {
                //变量scrollTop是滚动条滚动时，距离顶部的距离
                var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
                //变量windowHeight是可视区的高度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //变量scrollHeight是滚动条的总高度
                var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
                //滚动条到底部的条件
                if(scrollTop+windowHeight==scrollHeight){
                //写后台加载数据的函数
                    console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
                }
            }
        },
        mounted: function() {
            // 地图实例
            this.mapObj = new AMap.Map('amap-container', {
                resizeEnable: true,
                zoom: 16
            });
            setTimeout(() => {
                // 获取省份列表
                this.getProvinceList();
                AMap.service('AMap.Geocoder', () => {
                    const geocoder = new AMap.Geocoder({
                        extensions: "all"
                    });
                    // 地图组件点击事件处理
                    this.mapObj.on('click', (e) => {
                        // 清除已有标记点
                        this.mapObj.remove(this.markers);
                        // 经纬度写入
                        this.data.lng = e.lnglat.lng;
                        this.data.lat = e.lnglat.lat;
                        // 生成当前标记点
                        const marker = new AMap.Marker({
                            map: this.mapObj,
                            bubble: true
                        });
                        marker.setPosition(e.lnglat);
                        this.mapObj.setCenter(marker.getPosition());
                        this.markers.push(marker);
                        // 根据经纬度获取其他地址信息
                        geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
                            if (status === 'complete' && result.info === 'OK') {
                                // address字段写入
                                this.data.address=result.regeocode.formattedAddress;
                                // 其他地址信息写入
                                this.setAddress(5,result.regeocode.addressComponent);
                            }
                        });
                    });
                })
            }, 500)
            // console.log(this.$refs);
            // console.log(this.$refs.area.offsetTop);
            // this.$nextTick(() => {
            //     console.log(this.$refs.area.offsetTop);
            // });
            // window.addEventListener('scroll', this.setScrollTop(this.$refs.area.offsetTop), true)
        },
        methods: {
            // 设置页面滚动高度
            setScrollTop(value, flag) {
                if (flag) {
                    console.log(value)
                    document.documentElement.scrollTop = value;
                    window.pageYOffset = value;
                    document.body.scrollTop = value;
                    console.log(document.documentElement.scrollTop);
                    console.log(window.pageYOffset);
                    console.log(document.body.scrollTop);
                }
            },
            // 获得页面向左、向上卷动的距离
            getScroll() {
                return {
                    left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
                    top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
                };
            },
            // 返回
            returnBack() {
                // 整个页面的状态
                this.hiddenFlag = true;
                // 机构类型状态
                this.typeFlag = false;
                // 机构地址状态
                this.addressFlag = false;
                this.$nextTick(() => {
                    this.setScrollTop(this.$refs.icon.offsetTop, true);
                })
            },
            // 保存
            save(typeName) {
                this.hiddenFlag = true;
                this.typeFlag = false;
                console.log(this.data.typeIds);
            },
            // 选择一级目录
            selectParentOrgType(idx) {
                const _this = this;
                var isCheck = !this.typeList[idx].checked;
                if(isCheck) {
                    this.typeList[idx].checked = isCheck;
                    this.orgIndex = idx;
                    // 默认全选有问题
                    // this.selectOrgType(idx, idx, 'allIndex');
                } else {
                    this.typeList[idx].checked = isCheck;
                    this.orgIndex = idx;
                }
            },
            // 选择二级目录
            selectOrgType (idx, subIndex, allIndex, parentId) {
                // 判断最多选选三项
                if (this.typeIdss.length === 3) {
                    console.log("all--");
                    this.typeIdss.forEach((itemType, indexType) => {
                        // 判断是否是已选的三项
                        if (itemType === parentId) {
                            console.log("all---333")
                            // 全选
                            this.allSelect(idx, subIndex, allIndex, parentId);
                            // if (allIndex) {
                            //     console.log("all---444");
                            //     var allChecked = !this.typeList[idx].allChecked;
                            //     console.log(allChecked)
                            //     if (allChecked) {
                            //         this.typeList[idx].allChecked = allChecked
                            //         this.typeList.forEach((item) => {
                            //             if (item.allChecked) {
                            //                 item.sysOrgTypes.forEach((subItem) => {
                            //                     if (subItem.checked) {
                            //                         subItem.checked = subItem.checked;
                            //                     } else {
                            //                         subItem.checked = !subItem.checked;
                            //                     }                                    
                            //                 }) 
                            //             }
                            //         })
                            //     } else {
                            //         console.log("全选--2")
                            //         console.log(this.typeList);
                            //         this.typeList[idx].allChecked = allChecked;
                            //         this.typeList.forEach((item) => {
                            //             if (!item.allChecked) {
                            //                 item.sysOrgTypes.forEach((subItem) => {
                            //                     if (subItem.checked) {
                            //                         subItem.checked = !subItem.checked;
                            //                     }                                              
                            //                 })
                            //             }
                            //         })
                            //         console.log(this.typeList);
                            //     }                    
                            // } else { //非全选
                            //     // this.orgSubIndex = 0;
                            //     // this.selectParentOrgType(this.orgIndex)
                            //     var checked = !this.typeList[idx].sysOrgTypes[subIndex].checked;
                            //     console.log(checked);
                            //     console.log("非全选")
                            //     // 单选选中状态
                            //     if (checked) {
                            //         this.typeList[idx].sysOrgTypes[subIndex].checked = checked;
                            //         // 当单选全选时
                            //         var temp = 0;
                            //         this.typeList[idx].sysOrgTypes.forEach((subItem, subIndex) => {
                            //             if (subItem.checked) {
                            //                 temp += 1;
                            //             }
                            //         })
                            //         console.log(temp);
                            //         console.log(this.typeList[idx].sysOrgTypes.length);
                            //         if (temp === this.typeList[idx].sysOrgTypes.length) {
                            //             this.typeList[idx].allChecked = true;
                            //         }                        
                            //     } else {
                            //         // 单选取消状态
                            //         this.typeList[idx].sysOrgTypes[subIndex].checked = checked;
                            //         // 当单选全选时，取消一个
                            //         var temp02 = 0;
                            //         this.typeList[idx].sysOrgTypes.forEach((subItem, subIndex) => {
                            //             if (!subItem.checked) {
                            //                 temp02 += 1;
                            //             }
                            //         })
                            //         console.log(this.typeList[idx].sysOrgTypes.length);
                            //         console.log(temp02);
                            //         if (temp02 > 0 && temp02 < this.typeList[idx].sysOrgTypes.length) {
                            //             this.typeList[idx].allChecked = false;
                            //         }
                            //     }                    
                            // }
                        }
                    })
                } else {
                    console.log("allIndex")
                    this.allSelect(idx, subIndex, allIndex, parentId);
                    // 全选
                    // if (allIndex) {
                    //     var allChecked = !this.typeList[idx].allChecked;
                    //     console.log(allChecked);
                    //     if (allChecked) {
                    //         console.log("全选--1")
                    //         this.typeList[idx].allChecked = allChecked
                    //         this.typeList.forEach((item) => {
                    //             if (item.allChecked) {
                    //                 item.sysOrgTypes.forEach((subItem) => {
                    //                     if (subItem.checked) {
                    //                         subItem.checked = subItem.checked;
                    //                     } else {
                    //                         subItem.checked = !subItem.checked;
                    //                     }                                    
                    //                 }) 
                    //             }
                    //         })
                    //     } else {
                    //         console.log("全选--2")
                    //         console.log(this.typeList);
                    //         this.typeList[idx].allChecked = allChecked;
                    //         this.typeList.forEach((item) => {
                    //             if (!item.allChecked) {
                    //                 console.log("全选--3")
                    //                 item.sysOrgTypes.forEach((subItem) => {
                    //                     // subItem.checked = subItem.checked;
                    //                     if (subItem.checked) {
                    //                         subItem.checked = !subItem.checked;
                    //                     }                                      
                    //                 })
                    //             }
                    //         })
                    //         console.log(this.typeList);
                    //     }                    
                    // } else { //非全选
                    //     // this.orgSubIndex = 0;
                    //     // this.selectParentOrgType(this.orgIndex)
                    //     var checked = !this.typeList[idx].sysOrgTypes[subIndex].checked;
                    //     console.log(checked);
                    //     console.log("非全选")
                    //     // 单选选中状态
                    //     if (checked) {
                    //         this.typeList[idx].sysOrgTypes[subIndex].checked = checked;
                    //         // 当单选全选时
                    //         var temp = 0;
                    //         this.typeList[idx].sysOrgTypes.forEach((subItem, subIndex) => {
                    //             if (subItem.checked) {
                    //                 temp += 1;
                    //             }
                    //         })
                    //         console.log(temp);
                    //         console.log(this.typeList[idx].sysOrgTypes.length);
                    //         if (temp === this.typeList[idx].sysOrgTypes.length) {
                    //             this.typeList[idx].allChecked = true;
                    //         }                        
                    //     } else {
                    //         // 单选取消状态
                    //         this.typeList[idx].sysOrgTypes[subIndex].checked = checked;
                    //         // 当单选全选时，取消一个
                    //         var temp02 = 0;
                    //         this.typeList[idx].sysOrgTypes.forEach((subItem, subIndex) => {
                    //             if (!subItem.checked) {
                    //                 temp02 += 1;
                    //             }
                    //         })
                    //         console.log(this.typeList[idx].sysOrgTypes.length);
                    //         console.log(temp02);
                    //         if (temp02 > 0 && temp02 < this.typeList[idx].sysOrgTypes.length) {
                    //             this.typeList[idx].allChecked = false;
                    //         }
                    //     }                    
                    // }
                }                              
                console.log(this.typeList);
            },
            // 全选
            allSelect(idx, subIndex, allIndex, parentId) {
                if (allIndex) {
                    var allChecked = !this.typeList[idx].allChecked;
                    console.log(idx)
                    console.log(allChecked);
                    if (allChecked) {
                        console.log("全选--1")
                        if (idx !== 0) {
                            this.typeList[idx].allChecked = allChecked;
                            console.log(this.typeList[idx].allChecked);
                            this.typeList.forEach((item) => {
                                console.log(item.allChecked);
                                console.log(item.sysOrgTypes)
                                if (item.allChecked) {
                                    // 此处有问题，第一次进来默认没有修改二级checked的数据状态
                                    item.sysOrgTypes.forEach((subItem) => {
                                        if (subItem.checked) {
                                            subItem.checked = subItem.checked;
                                        } else {
                                            subItem.checked = !subItem.checked;
                                        }                                
                                    })
                                }
                            })
                        }                        

                        if (idx === 0) {
                            console.log(idx)
                            this.typeList[0].allChecked = allChecked;
                            this.typeList[0].sysOrgTypes.forEach((subItem) => {
                                console.log(subItem.checked);
                                if (subItem.checked) {
                                    subItem.checked = subItem.checked;
                                } else {
                                    // 第一次的时候改变了checked的值了，但是this.typeList[0].sysOrgTypes的没有改变
                                    subItem.checked = !subItem.checked;
                                }
                                console.log(subItem.checked)
                            })
                            console.log(this.typeList[0].sysOrgTypes)
                        }
                        console.log(this.typeList)
                    } else {
                        console.log("全选--2")
                        console.log(this.typeList);
                        this.typeList[idx].allChecked = allChecked;
                        this.typeList.forEach((item) => {
                            if (!item.allChecked) {
                                console.log("全选--3")
                                item.sysOrgTypes.forEach((subItem) => {
                                    // subItem.checked = subItem.checked;
                                    if (subItem.checked) {
                                        subItem.checked = !subItem.checked;
                                    }                                      
                                })
                            }
                        })
                        console.log(this.typeList);
                    }                    
                } else { //非全选
                    var checked = !this.typeList[idx].sysOrgTypes[subIndex].checked;
                    console.log(checked);
                    console.log("非全选")
                    // 单选选中状态
                    if (checked) {
                        this.typeList[idx].sysOrgTypes[subIndex].checked = checked;
                        // 当单选全选时
                        var temp = 0;
                        this.typeList[idx].sysOrgTypes.forEach((subItem, subIndex) => {
                            if (subItem.checked) {
                                temp += 1;
                            }
                        })
                        console.log(temp);
                        console.log(this.typeList[idx].sysOrgTypes.length);
                        if (temp === this.typeList[idx].sysOrgTypes.length) {
                            this.typeList[idx].allChecked = true;
                        }                        
                    } else {
                        // 单选取消状态
                        this.typeList[idx].sysOrgTypes[subIndex].checked = checked;
                        // 当单选全选时，取消一个
                        var temp02 = 0;
                        this.typeList[idx].sysOrgTypes.forEach((subItem, subIndex) => {
                            if (!subItem.checked) {
                                temp02 += 1;
                            }
                        })
                        console.log(this.typeList[idx].sysOrgTypes.length);
                        console.log(temp02);
                        if (temp02 > 0 && temp02 < this.typeList[idx].sysOrgTypes.length) {
                            this.typeList[idx].allChecked = false;
                        }
                    }                    
                }
            },
            // 选择机构类型
            chooseOrg() {
                this.hiddenFlag = false;
                this.typeFlag = true;
            },
            // 获取机构类型列表
            getType() {
                axios({
                    url: this.baseUrl + '/org/getAllOrgType',
                    type: 'json',
                    method: 'get'
                }).then((response) => {
                    if (response.data.result === "0") {
                        const data = [];
                        response.data.data.forEach((item) => {
                            if (item.sysOrgTypes) {
                                item.sysOrgTypes.forEach((subItem, subIndex) => {
                                    subItem.checked = false;                                    
                                })
                            }
                            item.checked = false;
                            item.allChecked = false;
                            data.push(item);
                        })
                        this.typeList = data;
                    } else {
                        alert(response.data);
                    }
                }).catch((error) => {
                    alert(error);
                });
            },
            // 验证码倒计时监听函数
            countDownCheck() {
                if (this.countDown <= 0) {
                    // 倒计时结束，清除监听函数，按钮设为可点击
                    clearInterval(this.fn_countDown);
                    this.codeButtonStatus = true;
                    this.countDown = 0;
                    return;
                }
                this.countDown = this.countDown - 1;
            },
            // 发送验证码
            sendCode() {
                if(!this.codeButtonStatus){
                    return
                }
                const regPhone = /^1[0-9]{10}$/;
                console.log(this.data.managerPhone)
                if (regPhone.test(this.data.managerPhone)) {
                    axios({
                        url: this.baseUrl + '/mobileCode/sendVerificationCode?phone=' + this.data.managerPhone + '&type=3',
                        type: 'json',
                        method: 'get',
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        transformRequest: [(data) => {
                            let ret = '';
                            for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                            ret = ret.slice(0, ret.length - 1);
                            return ret
                        }]
                    }).then((response) => {
                        console.log(response);
                        if (response.data.result === "0") {
                            // 验证码发送成功，按钮设为不可点击
                            this.codeButtonStatus = false;
                            // 倒计时开启
                            this.countDown = 60;
                            // 倒计时监听函数开启
                            this.fn_countDown = setInterval(this.countDownCheck, 1000);
                        }
                    }).catch((error) => {

                    });
                }
            },
            // 图片处理相关函数
            dataURLtoFile(url, filename) {
                let arr = url.split(','),
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new File([u8arr], filename, {
                    type: "image/jpeg"
                });
            },
            // 上传图片（触发input change事件）
            uploadImg(e, num) {
                this.getUploadToken();
                const file = e.target.files[0];    

                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                    alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                    return false
                }
                // 1：机构图片
                if (num === 1) {
                    this.photoLoading = true;
                    if (this.data.photos.length >= 5) {
                        this.setMessage("机构图片最多上传5张");
                        this.photoLoading = false;
                        return false;
                    }
                    setTimeout(() => {
                        this.uploadImgToQiniu(file);
                    }, 500);
                }
                // 2：机构logo
                if (num === 2) {
                    this.logoLoading = true;
                    setTimeout(() => {
                        this.uploadImgToQiniu01(file);
                    }, 500);
                }
                
                // 暂时不需要
                let reader = new FileReader();
                // reader.onload = (e) => {
                //     let data
                //     if (typeof e.target.result === 'object') {
                //         // 把Array Buffer转化为blob 如果是base64不需要
                //         data = window.URL.createObjectURL(new Blob([e.target.result]))
                //     } else {
                //         data = e.target.result
                //     }
                //     if (num === 1) {
                //         this.photoOption.img = data;
                //         this.photoOption.fileChoiced = true;
                //     } else if (num === 2) {
                //         this.logoOption.img = data;
                //         this.logoOption.fileChoiced = true;
                //     }
                // }
                // 转化为base64
                // reader.readAsDataURL(file)
                // 转化为blob
                reader.readAsArrayBuffer(file);                
            },
            // 获取上传token
            getUploadToken() {
                axios({
                    url: this.baseUrl + '/file/getToken',
                    type: 'json',
                    method: 'get',
                    processData: false,
                }).then((response) => {
                    if (response.result = "0") {
                        this.uploadToken = response.data.data;                        
                    } else {
                        alert(response);
                    }
                }).catch((error) => {
                    this.setMessage(error);
                    alert(error);
                });
            },
            // 机构图片（上传图片到七牛，网上提供的方法）(此方法在苹果机上不能用)
            uploadImgToQiniu02(file){
                const axiosInstance = axios.create({withCredentials: false});    //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
                let data = new FormData();
                data.append('token', this.uploadToken);     //七牛需要的token，叫后台给，是七牛账号密码等组成的hash
                data.append('file', file);
                console.log(data);
                axiosInstance({
                    url: 'http://upload.qiniup.com', //上传地址
                    method: 'POST',                    
                    data: data,
                    timeout: 30000, //超时时间，因为图片上传有可能需要很久
                    onUploadProgress: (progressEvent) => {
                        //imgLoadPercent 是上传进度，可以用来添加进度条
                        let imgLoadPercent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                    },
                }).then((response) => {
                    console.log(response);
                    if (response.code = "0") {
                        console.log(response.data)
                        this.setMessage("图片提交成功");
                        this.data.photos.push(response.data.key);
                        console.log(this.data.photos);
                        this.photoOption.img = "";
                        this.photoOption.fileChoiced = false;
                        //上传成功，把input的value设置为空，不然 无法两次选择同一张图片
                        this.$refs.photoInputEle.value = "";
                    }
                }).catch(function(err) {
                    //上传失败
                    console.log(err);
                    if (err) {
                        this.setMessage(err);
                    } else {
                        this.setMessage("图片提交失败");
                    }
                    

                });
            },
            // 机构图片（上传图片到七牛）(官方文档给的)
            uploadImgToQiniu(file) {
                var _this = this;
                var file = file;
                console.log(file);
                var key = UUID.create().toString().replace(/-/g,"");
                var token = this.uploadToken;
                console.log(token)
                var config = {
                    region: qiniu.region.z0
                };
                var observer = {
                    next (res) {
                        console.log(res);
                        _this.photoLoading = false;
                    },
                    error (err) {
                        console.log(err);
                        _this.photoLoading = false;
                        if (err) {
                            _this.setMessage(err);
                        } else {
                            _this.setMessage("图片提交失败");
                        }
                    }, 
                    complete (res) {
                        console.log(res);
                        _this.photoLoading = false;
                        // _this.setMessage("图片提交成功");
                        _this.data.photos.push(res.key);
                        console.log(_this.data.photos);
                        //上传成功，把input的value设置为空，不然 无法两次选择同一张图片
                        _this.$refs.photoInputEle.value = "";
                    }
                }
                var observable = qiniu.upload(file, key, token, config);
                observable.subscribe(observer); // 上传开始
            },
            // 机构LOGO （上传图片到七牛01）(官方文档给的)
            uploadImgToQiniu01(file) {
                var _this = this;
                var file = file;
                console.log(file);
                var key = UUID.create().toString().replace(/-/g,"");
                var token = this.uploadToken;
                console.log(token)
                var config = {
                    region: qiniu.region.z0
                };
                var observer = {
                    next (res) {
                        console.log(res);
                        _this.logoLoading = false;
                    },
                    error (err) {
                        console.log(err);
                        _this.logoLoading = false;
                        if (err) {
                            _this.setMessage(err);
                        } else {
                            _this.setMessage("图片提交失败");
                        }
                    }, 
                    complete (res) {
                        console.log(res);
                        _this.logoLoading = false;
                        // _this.setMessage("图片提交成功");
                        _this.data.icon = res.key;
                        console.log(_this.data.icon);
                        //上传成功，把input的value设置为空，不然 无法两次选择同一张图片
                        document.getElementById("logoUploads").value = '';
                    }
                }
                var observable = qiniu.upload(file, key, token, config);
                observable.subscribe(observer); // 上传开始
            },
            // 机构图片提交（可以裁剪的）
            photoSubmit() {
                this.$refs.photoCropper.getCropData((data) => {
                    const file = this.dataURLtoFile(data, "effective.jpg");
                    const formData = new FormData();
                    formData.append("file", file);
                    // 上传七牛
                    this.uploadImgToQiniu(file)

                    // axios({
                    //     url: '/w/file/upload',
                    //     type: 'json',
                    //     method: 'post',
                    //     processData: false,
                    //     data: formData
                    // }).then((response) => {
                    //     console.log(response);
                    //     if (response.code = "0") {
                    //         this.photoList.push(response.data.data);
                    //         this.photoOption.img = "";
                    //         this.photoOption.fileChoiced = false;
                    //         this.$refs.photoInputEle.value = "";
                    //     }
                    // }).catch((error) => {
                    //     this.setMessage("图片提交失败");
                    // });
                })
            },
            // 机构图片删除
            photoDelete(index) {
                let data = this.data.photos;
                data.splice(index, 1);
                this.photos = data;
            },
            // 机构logo提交（可以裁剪的）
            logoSubmit() {
                this.$refs.logoCropper.getCropData((data) => {
                    const file = this.dataURLtoFile(data, "effective.jpg");
                    const formData = new FormData();
                    formData.append("file", file);
                    // axios({
                    //     url: '/w/file/upload',
                    //     type: 'json',
                    //     method: 'post',
                    //     processData: false,
                    //     data: formData
                    // }).then((response) => {
                    //     console.log(response);
                    //     if (response.code = "0") {
                    //         this.data.icon = response.data.data;
                    //         this.logoOption.img = "";
                    //         this.logoOption.fileChoiced = false;
                    //         this.$refs.logoInputEle.value = "";
                    //     }
                    // }).catch((error) => {
                    //     this.setMessage("图片提交失败");
                    // });
                })
            },
            // 机构LOGO删除
            logoDelete() {
                this.data.icon = ""
            },
            // 机构地址
            orgAddress () {
                this.hiddenFlag = false;
                this.addressFlag = true;
                // if (!this.data.street) {
                //     this.setAddress(4, this.data.areaName);
                // }
                // if (!this.data.areaName) {
                //     this.setAddress(3, this.data.cityName);
                // }
                // if (!this.data.cityName) {
                //     this.setAddress(2, this.data.provinceName);
                // }
                // if (!this.data.provinceName) {
                //     this.setAddress(1, this.data.provinceName);
                // }
                if (this.data.street) {
                    this.provinceFlag = false;
                    this.cityFlag = false;
                    this.areaFlag = false;
                    this.streetFlag = true;
                    this.data.lng="";
                    this.data.lat="";
                    this.data.address="";
                    this.data.detailedAddress="";
                }
            },
            // 选择省份
            chooseProvince($event, provinceId, provinceName) {
                this.data.provinceId = provinceId;
                this.data.provinceName = provinceName;
            },
            // 获取省市区列表
            getProvinceList() {
                this.mapObj.plugin('AMap.DistrictSearch', () => {
                    var districtSearch = new AMap.DistrictSearch({
                        level: 'country',
                        subdistrict: 3
                    });

                    districtSearch.search('中国', (status, result) => {
                        this.provinceList = result.districtList[0].districtList;
                        this.provinceNameList = this.provinceList.map(item => item.name);
                    })
                })
            },
            // 地址字段写入
            setAddress(type, value, value02) {
                const vm = this;
                // 写入已选省份信息并清除下级信息
                if(type===1){
                    if (!value) {
                        this.realdOnly = true
                        return false
                    } else {
                        if (value02) {
                            console.log(value02);
                            this.data.provinceName = "";
                            this.data.cityName = "";
                            this.data.areaName = "";
                            this.data.street = "";
                            this.data.area = "";
                            this.provinceFlag = true;
                            this.cityFlag = false;
                            this.areaFlag = false;
                            this.streetFlag = false;
                        } else {
                            console.log(value);
                            const fnFilter = (item) => {
                                return item.name === value
                            };
                            this.provinceFlag = false;
                            this.cityFlag = true;
                            this.areaFlag = false;
                            this.streetFlag = false;
                            this.data.provinceName = value;
                            this.data.provinceId = this.provinceList.filter(fnFilter)[0] ? this.provinceList.filter(fnFilter)[0].adcode : null;
                            this.cityList = this.provinceList.filter(fnFilter)[0] ? this.provinceList.filter(fnFilter)[0].districtList : [];
                            console.log(this.cityList);
                            this.data.cityName="";
                            this.data.cityId=null;
                            this.areaList=[];
                            this.data.areaName="";
                            this.data.areaId=null;
                            this.streetList=[];
                            this.data.street="";
                            // this.data.lng="";
                            // this.data.lat="";
                            // this.data.address="";
                            this.data.detailedAddress="";
                        } 
                    }
                }
                // 写入已选城市信息并清除下级信息
                if(type===2){
                    if (!value) {
                        this.realdOnly = true;
                        return false
                    } else {
                        if (value02) {
                            console.log(value02);
                            // this.data.provinceName = "";
                            this.data.cityName = "";
                            this.data.areaName = "";
                            this.data.street = "";
                            this.data.area = "";
                            this.provinceFlag = false;
                            this.cityFlag = true;
                            this.areaFlag = false;
                            this.streetFlag = false;
                        } else {
                            const fnFilter = (item) => {
                                return item.name === value
                            };
                            this.provinceFlag = false;
                            this.cityFlag = false;
                            this.areaFlag = true;
                            this.streetFlag = false;
                            this.data.cityName = value;
                            console.log(value)
                            this.data.cityId = this.cityList.filter(fnFilter)[0] ? this.cityList.filter(fnFilter)[0].adcode : null;
                            this.areaList = this.cityList.filter(fnFilter)[0] ? this.cityList.filter(fnFilter)[0].districtList : [];
                            console.log(this.areaList)
                            this.data.areaName="";
                            this.data.areaId=null;
                            this.streetList=[];
                            this.data.street="";
                            // this.data.lng="";
                            // this.data.lat="";
                            // this.data.address="";
                            this.data.detailedAddress="";
                        }
                    }                    
                }
                // 写入已选区信息并清除下级信息
                if(type===3){
                    if (!value) {
                        this.realdOnly = true;
                        return false
                    } else {
                        if (value02) {
                            console.log(value02);
                            // this.data.provinceName = "";
                            // this.data.cityName = "";
                            this.data.areaName = "";
                            this.data.street = "";
                            this.data.area = "";
                            this.provinceFlag = false;
                            this.cityFlag = false;
                            this.areaFlag = true;
                            this.streetFlag = false;
                        } else {
                            const fnFilter = (item) => {
                                return item.name === value
                            };
                            console.log(value)
                            // 省市级状态设置
                            this.provinceFlag = false;
                            this.cityFlag = false;
                            this.areaFlag = false;
                            this.streetFlag = true;
                            this.data.areaName = value;
                            this.data.areaId = this.areaList.filter(fnFilter)[0] ? this.areaList.filter(fnFilter)[0].adcode : null;
                            this.mapObj.plugin('AMap.DistrictSearch', () => {
                                var districtSearch = new AMap.DistrictSearch({
                                    level: 'district',
                                    subdistrict: 1
                                });
                                districtSearch.search(this.data.areaId, (status, result) => {
                                    this.streetList = result.districtList[0].districtList;
                                    this.data.street="";
                                    // this.data.lng="";
                                    // this.data.lat="";
                                    // this.data.address="";
                                    this.data.detailedAddress="";
                                })
                            })
                        }
                    }                    
                }
                // 写入已选街道信息并清除下级信息
                if(type===4){
                    if (!value) {
                        this.realdOnly = true;
                        return false
                    }
                    this.hiddenFlag = true;
                    this.addressFlag = false;
                    this.typeFlag = false;
                    this.provinceFlag = false;
                    this.cityFlag = false;
                    this.areaFlag = false;
                    this.streetFlag = true;
                    this.data.street = value;
                    this.data.area = this.data.provinceName + this.data.cityName + this.data.areaName + this.data.street;
                    // this.data.lng="";
                    // this.data.lat="";
                    // this.data.address="";
                    this.data.detailedAddress="";
                    // 不知道为什么获取的offsetTop是0
                    console.log(vm.$refs);
                    console.log(vm.$refs.area.scrollTop);
                    console.log(vm.$refs.area.baseURI);
                    console.log(vm.$refs.area.clientWidth);
                    console.log(vm.$refs.area.hidden);
                    // 通过下面的方法可以获得offsetTop
                    vm.$nextTick(() => {
                        console.log(vm.$refs.area.offsetTop);
                        console.log(vm.$refs);
                        console.log(vm.$refs.addressTextarea.autofocus);
                        vm.$refs.addressTextarea.autofocus = true;
                        vm.$refs.addressTextarea.focus()
                        console.log(vm.$refs.addressTextarea.autofocus);
                        vm.setScrollTop(vm.$refs.area.offsetTop, true);
                    });
                }
                // 地址信息整体写入
                if(type===5){
                    // 地区信息字段（用以获取不包含地区信息的详细地址内容）
                    let areaString=value.province+value.city+value.district+value.township;
                    // 获取省份ID
                    const provinceFilter = (item) => {
                        return item.name === value.province
                    };
                    this.data.provinceId = this.provinceList.filter(provinceFilter)[0] ? this.provinceList.filter(provinceFilter)[0].adcode: null;
                    // 获取城市列表
                    this.cityList = this.provinceList.filter(provinceFilter)[0] ? this.provinceList.filter(provinceFilter)[0].districtList: [];
                    // 城市列表只有一条信息，如直辖市，导致value.city为空，则取城市列表第一条作为有效信息
                    if(this.cityList.length===1&&!value.city){
                        value.city=this.cityList[0].name;
                    }
                    // 获取城市ID
                    const cityFilter = (item) => {
                        return item.name === value.city
                    };
                    this.data.cityId = this.cityList.filter(cityFilter)[0] ? this.cityList.filter(cityFilter)[0].adcode : null;
                    // 获取地区列表
                    this.areaList = this.cityList.filter(cityFilter)[0] ? this.cityList.filter(cityFilter)[0].districtList : [];
                    // 根据区ID获取街道列表
                    this.mapObj.plugin('AMap.DistrictSearch', () => {
                        var districtSearch = new AMap.DistrictSearch({
                            level: 'district',
                            subdistrict: 1
                        });
                        districtSearch.search(value.adcode, (status, result) => {
                            this.streetList = result.districtList[0].districtList;
                            // 地址信息获取完全之后写入data
                            this.data.provinceName=value.province;
                            this.data.cityName=value.city;
                            this.data.areaName=value.district;
                            this.data.areaId=value.adcode;
                            this.data.street=value.township;
                            // 详细地址取address不包含地区信息（provinceName，cityName，areaName，street）的部分
                            this.data.detailedAddress=this.data.address.replace(areaString,"");
                        })
                    })
                }
            },
            // 详细地址信息变更处理
            detailedAddressChanged() {
                if(!this.data.detailedAddress){
                    this.data.lng="";
                    this.data.lat="";
                    this.data.address="";
                    return
                }
                // 定位地址信息拼接
                let keyword = this.data.provinceName + this.data.cityName + this.data.areaName + this.data.street + this.data.detailedAddress;
                // 清除已有标记点
                this.mapObj.remove(this.markers);
                this.mapObj.plugin('AMap.Geocoder', () => {
                    const geocoder = new AMap.Geocoder({});
                    const marker = new AMap.Marker({
                        map: this.mapObj,
                        bubble: true
                    });
                    // 根据地址关键词获取经纬度
                    geocoder.getLocation(keyword, (status_, result_) => {
                        if (status_ === 'complete' && result_.info === 'OK') {
                            // 根据经纬度获取更详细的地址信息
                            geocoder.getAddress([result_.geocodes[0].location.lng, result_.geocodes[0].location.lat], (status, result) => {
                              if (status === 'complete' && result.info === 'OK') {
                                    // 经纬度写入
                                    this.data.lng = result_.geocodes[0].location.lng;
                                    this.data.lat = result_.geocodes[0].location.lat;
                                    // 生成当前标记点
                                    marker.setPosition(result_.geocodes[0].location);
                                    this.mapObj.setCenter(marker.getPosition());
                                    this.markers.push(marker);
                                    // address字段写入
                                    this.data.address = keyword;
                                    // 其他地址信息写入
                                    this.setAddress(5,result.regeocode.addressComponent);
                                }
                            });
                        }
                    });
                });
            },
            // 全局提示框内容设置
            setMessage(value) {
                clearTimeout(this.message.fnTimeout);
                this.message.flag = true;
                this.message.value = value;
                this.message.fnTimeout = setTimeout(() => {
                    this.message = {
                        flag: false,
                        value: "",
                        fnTimeout: ""
                    }
                }, 3000)
            },
            // 信息提交
            submit() {
                if (this.isNUll()) {
                   if(this.submitButtonFlag && this.nameCheck() && this.isTelephone() && this.licenseNumberCheck()) {
                        axios({
                            url: this.baseUrl + '/org/saveOrg',
                            type: 'json',
                            method: 'post',
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            data: this.data,
                            transformRequest: [(data) => {
                                let ret = '';
                                for (let it in data) {
                                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                                }
                                ret = ret.slice(0, ret.length - 1);
                                return ret
                            }]
                        }).then((response) => {
                            console.log(response);
                            if (response.data.result === "0") {
                                this.setMessage("提交成功，请耐心等待审核通过");
                                this.message.flagSuc = true;                            
                                this.photoOption = {
                                    fileChoiced: false,
                                    img: ''
                                },
                                this.photoList = [],
                                this.logoOption = {
                                    fileChoiced: false,
                                    img: ''
                                },
                                this.data = {
                                    source: 0,
                                    name: "",
                                    typeIds: [],
                                    telephone: "",
                                    managerName: "",
                                    managerPhone: "",
                                    code: "",
                                    description: "",
                                    photos: [],
                                    icon: "",
                                    provinceName: "",
                                    provinceId: null,
                                    cityName: "",
                                    cityId: null,
                                    areaName: "",
                                    areaId: null,
                                    street: "",
                                    area: "",
                                    detailedAddress: "",
                                    companyName: "",
                                    licenseNumber: ""
                                },
                                this.codeButtonStatus = true,
                                this.countDown = 0,
                                this.fn_countDown = "",
                                // 状态没有设置为默认值导致省份没有显示
                                this.hiddenFlag = true;
                                this.addressFlag = false;
                                this.typeFlag = false;
                                this.provinceFlag = true;
                                this.cityFlag = false;
                                this.areaFlag = false;
                                this.streetFlag = false;
                                this.cityList = [],
                                this.areaList = [],
                                this.streetList = [],
                                // 清除地图已有标记点
                                // this.mapObj.remove(this.markers);
                                // this.markers = [],
                                this.checkList = {
                                    name: true,
                                    typeIds: true,
                                    telephone: true,
                                    managerName: true,
                                    managerPhone: true,
                                    code: true,
                                    photos: true,
                                    description: true,
                                    icon: true,
                                    area: true,
                                    detailedAddress: true,
                                    companyName: true,
                                    licenseNumber: true
                                }
                                console.log(this.provinceList);
                                this.getType();
                                this.getProvinceList();
                            }else{
                                this.setMessage(response.data.message);
                            }
                        }).catch((error) => {
                            this.setMessage("提交失败");
                        });
                    } else {
                        // this.isNULL();
                        let flag=true;
                        Object.keys(this.checkList).forEach((key) => {
                            console.log(key)
                            if(key==="area"){
                                if(!this.data.street){
                                    this.addressTips="机构地址不能为空";
                                    this.checkList.area=false;
                                    this.setScrollTop(this.$refs[key].offsetTop, flag);
                                    flag=false;
                                    return
                                }
                                if(!this.data.detailedAddress){
                                    this.addressTips="机构详细地址不能为空";
                                    this.checkList.area=false;
                                    this.$nextTick(() => {
                                        this.setScrollTop(this.$refs[key].offsetTop, flag);
                                    })                                
                                    flag=false;
                                    return
                                }
                            }
                            // console.log(this.data[key]);
                            if(!this.data[key]){
                                console.log(this.data[key])
                                if(key==="photos"&&flag===true){
                                    if(this.photoOption.fileChoiced){
                                        this.setMessage("机构图片未提交");
                                    }
                                }
                                if(key==="icon"&&flag===true){
                                    if(this.logoOption.fileChoiced){
                                        this.setMessage("机构LOGO未提交");
                                    }
                                }
                                console.log(this.data)
                                this.checkList[key]=false;
                                console.log(this.checkList);
                                this.setMessage("信息填写不完整");
                                this.$nextTick(() => {
                                    this.setScrollTop(this.$refs[key].offsetTop, flag);
                                });
                                flag=false;
                            }
                        })
                    } 
                }                
            },
            // 数组去重
            uniq(array){
                var temp = []; //一个新的临时数组
                for(var i = 0; i < array.length; i++){
                    if(temp.indexOf(array[i]) == -1){
                        temp.push(array[i]);
                    }
                }
                return temp;
            },
            // 为空校验
            isNUll() {
                if(!this.data.name) {
                    this.setMessage("机构名称不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.name.offsetTop, true);
                    });                 
                    return false;
                }
                if(!this.data.typeIds.length) {
                    this.setMessage("机构类型不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.typeIds.offsetTop, true);
                    });                    
                    return false;
                }
                if(!this.data.telephone) {
                    this.setMessage("机构电话不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.telephone.offsetTop, true);
                    });                    
                    return false;
                }
                if(!this.data.managerName) {
                    this.setMessage("管理员不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.managerName.offsetTop, true);
                    });                    
                    return false;
                }
                if(!this.data.managerPhone) {
                    this.setMessage("手机号码不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.managerPhone.offsetTop, true);
                    });                    
                    return false;
                }
                if(!this.data.code) {
                    this.setMessage("手机验证码不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.code.offsetTop, true);
                    })                    
                    return false;
                }
                if(!this.data.photos.length) {
                    this.setMessage("机构图片不能为空");
                    this.$nextTick(() => {
                         this.setScrollTop(this.$refs.photos.offsetTop, true);
                    })                   
                    return false;
                }
                if(!this.data.description) {
                    this.setMessage("机构简介不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.description.offsetTop, true);
                    });                    
                    return false;
                }
                if(!this.data.icon) {
                    this.setMessage("机构LOGO不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.icon.offsetTop, true);
                    })                    
                    return false;
                }
                console.log(this.data.area)
                console.log(this.data.detailedAddress)
                if(!this.data.area) {
                    this.setMessage("机构地址不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.area.offsetTop, true);
                    });                    
                    return false;
                }
                if(!this.data.detailedAddress) {
                    this.setMessage("机构详细地址不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.area.offsetTop, true);
                    });                    
                    return false;
                }

                if(!this.data.companyName) {
                    this.setMessage("企业名称不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.companyName.offsetTop, true);
                    });                    
                    return false;
                }
                if(!this.data.licenseNumber) {
                    this.setMessage("执照号码不能为空");
                    this.$nextTick(() => {
                        this.setScrollTop(this.$refs.licenseNumber.offsetTop, true);  
                    });                   
                    return false;
                }
                return true;
            },
            // 机构名称校验
            nameCheck() {
                if (this.data.name.length > 20) {
                    this.setMessage("机构名称20个字以内");
                    // this.submitButtonFlag = false;
                    return false;
                } else {
                    return true;
                }
                console.log(this.data.name);
            },
            // 机构电话校验
            isTelephone() {
                const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
                const isMob = /^1[0-9]{10}$/;
                if (isPhone.test(this.data.telephone) || isMob.test(this.data.telephone)) {
                    return true;
                } else {
                    this.setMessage('请输入正确机构电话');
                    return false;
                }
            },
            // 营业执照校验
            licenseNumberCheck() {
                if (this.data.licenseNumber.length !== 18) {
                    this.setMessage("请输入18位正确执照号码");
                    return false;
                } else {
                    return true;
                }
            },
        },
        computed: {
            // rollingForbiddenFlag: function() {
            //     return this.photoExample.flag || this.logoExample.flag
            // },
            orgName: function () {
                return this.data.name.length > 15 ? this.data.name.slice(0, 14) + '...' : this.data.name;
            },
            typeNames: function() {
                var t = "";
                this.typeList.forEach((item) => {
                    if (item.sysOrgTypes) {
                        item.sysOrgTypes.forEach((subItem) => {
                            if (subItem.checked) {
                                t += subItem.name + "/"
                            }
                        })
                    }
                })
                t = t.slice(0, t.length - 1);
                t = t.length > 5 ? t.slice(0, 18) + "..." : t;
                return t;
            },
            isPhoneNumber: function() {
                return !!/^1[3|4|5|7|8][0-9]{9}$/.test(this.data.managerPhone)
            },
            provinceName: function() {
                return this.data.provinceName ? this.data.provinceName.length > 5 ? this.data.provinceName.slice(0, 4) + "..." : this.data.provinceName : "请选择省份"
            },
            cityName: function() {
                return this.data.cityName ? this.data.cityName.length > 5 ? this.data.cityName.slice(0, 4) + "..." : this.data.cityName : "请选择市"
            },
            areaName: function() {
                return this.data.areaName ? this.data.areaName.length > 5 ? this.data.areaName.slice(0, 4) + "..." : this.data.areaName : "请选择区"
            },
            street: function() {
                return this.data.street ? this.data.street.length > 5 ? this.data.street.slice(0, 4) + "..." : this.data.street : "请选择街道"
            }
        },
        watch: {
            scrollTop() {
                this.setScrollTop();
            },
            typeList: {
                handler(data) {
                    // 一级
                    const typeIdss = [];
                    // 二级
                    const typeIds = [];
                    const typeNames = [];
                    data.forEach((item) => {
                        // 二级
                        if (item.sysOrgTypes) {
                            item.sysOrgTypes.forEach((subItem, subIndex) => {
                                if (subItem.checked) {
                                    typeIds.push(subItem.id);
                                    typeIdss.push(subItem.parentId);
                                }
                            })
                        }
                    });
                    this.data.typeIds = typeIds;
                    // this.typeIdss = typeIdss;
                    this.typeIdss = this.uniq(typeIdss);
                    // 判断二级
                    if (this.typeIdss.length >= 3) {
                        this.setMessage("机构类型最多选择3项");
                        return false;
                    }
                    // this.data.typeIdTwo = typeIds[1]||0;
                    // this.data.typeIdThree = typeIds[2]||0;
                    // const refsType = this.$refs.type || [];
                    // if (typeIds.length >= 3) {
                    //     refsType.forEach((item) => {
                    //         if (!item.checked) {
                    //             item.disabled = true;
                    //         }
                    //     })
                    // } else {
                    //     refsType.forEach((item) => {
                    //         item.disabled = false;
                    //     })
                    // }
                },
                deep: true
            },
            photoList(data) {
                this.data.photo = data[0];
                this.data.photo2 = data[1] || 0;
                this.data.photo3 = data[2] || 0;
                this.data.photo4 = data[3] || 0;
                this.data.photo5 = data[4] || 0;
            },
            data: {
                handler(data) {
                    let flag=true;
                    Object.keys(this.checkList).forEach((key) => {
                        if(key==="area"){
                            // if(this.data.lng&&this.data.detailedAddress){
                            if(this.data.area && this.data.detailedAddress){
                                this.checkList.area=true;
                            }else {
                                flag=false;
                            }
                            return
                        }
                        if(this.data[key]){
                            this.checkList[key]=true;
                        }else{
                            flag=false;
                        }
                    })
                    if(flag){
                        this.submitButtonFlag=true
                    }else{
                        this.submitButtonFlag=false
                    }
                },
                deep: true
            },
        },               
    };
</script>

<style scoped>
    @import "../assets/style/Home.css";
</style>